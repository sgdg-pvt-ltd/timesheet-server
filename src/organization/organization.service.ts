import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Admin } from 'src/admin/entities/admin.entity';
import { UserRole } from 'src/common/role';
import ErrorMessage from 'src/common/error-message';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
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
    return this.organizationRepository.find({ relations: ['users'] });
  }

  findOne(id: string): Promise<Organization> {
    return this.organizationRepository.findOne({
      where: { id },
      relations: ['users'],
    });
  }

  async update(id: string, updateOrganizationDto: UpdateOrganizationDto): Promise<Organization> {
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
}
