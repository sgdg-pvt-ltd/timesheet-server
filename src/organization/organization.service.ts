import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Admin } from 'src/admin/entities/admin.entity';
import { UserRole } from 'src/common/role';
import ErrorMessage from 'src/common/error-message';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { SwitchUserOrganizationDto } from './dto/switch-user-organization.dto';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createOrganizationDto: CreateOrganizationDto, adminId: string): Promise<Organization> {
    const {name} = createOrganizationDto
    const lowerCaseName = name.toLowerCase();
    const exsitsName =  await this.organizationRepository.findOne({where: {name: name.toLowerCase()}})
    if(exsitsName){
      throw new HttpException(ErrorMessage.ORGANIZATION_NAME_EXISTS, HttpStatus.BAD_REQUEST);
    }
    const admin = await this.adminRepository.findOne({where: {id: adminId}})
    if(!admin || admin.role !== UserRole.superAdmin){
      throw new HttpException(ErrorMessage.SUPERADMIN_PERMISSION, HttpStatus.BAD_REQUEST);
    }
    const organization = this.organizationRepository.create({...createOrganizationDto, name:lowerCaseName});
    return this.organizationRepository.save(organization);
  }

  findAll(): Promise<Organization[]> {
    return this.organizationRepository.find({ relations: ['users'],  order: { createdAt: 'ASC' }  });
  }

  findOne(id: string): Promise<Organization> {
    return this.organizationRepository.findOne({
      where: { id },
      relations: ['users'],
    });
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
    const admin = await this.adminRepository.findOne({ where: { id: adminId } });
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
    user.organizationId = organizationId;
    await this.userRepository.save(user);
    const payload = { email: user.email, id: user.id, organizationId: user.organizationId };
    const token = this.jwtService.sign(payload);
    return { token };
  }
}
