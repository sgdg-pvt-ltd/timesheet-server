import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { UserRole } from 'src/common/enum/role';
import ErrorMessage from 'src/common/error-message';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { SwitchUserOrganizationDto } from './dto/switch-user-organization.dto';
import { UserOrganization } from './entities/userOrganization.entity';
import { OrganizationUsersDto } from './dto/user-organization-list.dto';
import { UserDetailsDto } from './dto/user-details.dto';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserOrganization)
    private readonly userOrganizationRepository: Repository<UserOrganization>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createOrganizationDto: CreateOrganizationDto, adminId: string): Promise<Organization> {
    const {name} = createOrganizationDto
    const lowerCaseName = name.toLowerCase();
    const exsitsName =  await this.organizationRepository.findOne({where: {name: name.toLowerCase()}})
    if(exsitsName){
      throw new HttpException(ErrorMessage.ORGANIZATION_NAME_EXISTS, HttpStatus.BAD_REQUEST);
    }
    const admin = await this.userRepository.findOne({where: {id: adminId}})
    if(!admin || admin.role !== UserRole.superAdmin){
      throw new HttpException(ErrorMessage.SUPERADMIN_PERMISSION, HttpStatus.BAD_REQUEST);
    }
    const organization = this.organizationRepository.create({ ...createOrganizationDto, name: lowerCaseName,  adminId: adminId });
    const savedOrganization = await this.organizationRepository.save(organization);
    admin.organizationId = savedOrganization.id;
    await this.userRepository.save(admin);
    return savedOrganization;
  }

  findAll(): Promise<Organization[]> {
    return this.organizationRepository.find({ order: { createdAt: 'ASC' }  });
  }

  findOne(id: string): Promise<Organization> {
    return this.organizationRepository.findOne({
      where: { id }
    });
  }

  async getSingleOrganizationWithUser(organizationId: string): Promise<OrganizationUsersDto> {
    const organization = await this.organizationRepository.findOne({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new HttpException(`Organization with ID ${organizationId} not found`, HttpStatus.NOT_FOUND);
    }
    const userOrganizations = await this.userOrganizationRepository.find({
      where: { organization: { id: organization.id } },
      relations: ['user'],
    });

   
    const userDetails: UserDetailsDto[] = userOrganizations.map((userOrg) => ({
      email: userOrg.user.email,
      role: userOrg.user.role,
      createdAt: userOrg.user.createdAt,
      updatedAt: userOrg.user.updatedAt,
    }));

    return {
      organizationId: organization.id,
      organizationName: organization.name,
      createdAt: organization.createdAt,
      updatedAt: organization.updatedAt,
      userDetails: userDetails,
    };
  }


  async getOrganizationsWithUsers(): Promise<OrganizationUsersDto[]> {
    const organizations = await this.organizationRepository.find();
    const result: OrganizationUsersDto[] = [];
  
    for (const organization of organizations) {
      const userOrganizations = await this.userOrganizationRepository.find({
        where: { organization: { id: organization.id } },
        relations: ['user'],
      });
  
      const userDetails: UserDetailsDto[] = userOrganizations.map((userOrg) => ({
        email: userOrg.user.email,
        role: userOrg.user.role,
        createdAt: userOrg.user.createdAt,
        updatedAt: userOrg.user.updatedAt,
      }));
  
      result.push({
        organizationId: organization.id,
        organizationName: organization.name,
        createdAt: organization.createdAt,
        updatedAt: organization.updatedAt,
        userDetails: userDetails,
      });
    }
  
    return result;
  }
  


  async update(id: string, updateOrganizationDto: UpdateOrganizationDto): Promise<Organization> {
    if (updateOrganizationDto.name) {
      updateOrganizationDto.name = updateOrganizationDto.name.toLowerCase();
    }
    await this.organizationRepository.update(id, updateOrganizationDto);
    return this.organizationRepository.findOne({
      where: { id },
      relations: ['users'],
    });
  }

  async softDelete(id: string, adminId: string): Promise<void> {
    const admin = await this.userRepository.findOne({ where: { id: adminId } });
    if (!admin || admin.role !== UserRole.superAdmin) {
      throw new HttpException(ErrorMessage.SUPERADMIN_DELETE, HttpStatus.BAD_REQUEST);
    }
    const result = await this.organizationRepository.softDelete(id);
    if (result.affected === 0) {
      throw new HttpException(ErrorMessage.ORGANIZATION_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
  }

  async switchUserOrganization(switchUserOrganizationDto: SwitchUserOrganizationDto): Promise<{ token: string }> {
    const { userId, organizationId } = switchUserOrganizationDto;
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const organization = await this.organizationRepository.findOne({ where: { id: organizationId } });
    if (!organization) {
      throw new HttpException('Organization not found', HttpStatus.NOT_FOUND);
    }
    let userOrganization = await this.userOrganizationRepository.findOne({
      where: { userId: user.id, organizationId },
    });
    if (!userOrganization) {
      userOrganization = this.userOrganizationRepository.create({
        userId: user.id,
        organizationId,
        role: user.role, 
      });
      await this.userOrganizationRepository.save(userOrganization);
    } else {
      userOrganization.role = user.role; // Update role if necessary
      await this.userOrganizationRepository.save(userOrganization);
    }
    const payload = { email: user.email, id: user.id, organizationId: userOrganization.organizationId };
    const token = this.jwtService.sign(payload);

    return { token };
  }
}
