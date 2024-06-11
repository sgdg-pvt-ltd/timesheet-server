import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { OrganizationService } from './organization.service';
import { OrganizationResolver } from './organization.resolver';
import { Admin } from 'src/admin/entities/admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Organization, Admin])],
  providers: [OrganizationService, OrganizationResolver],
})
export class OrganizationModule {}
