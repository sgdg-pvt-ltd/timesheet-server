import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { OrganizationService } from './organization.service';
import { OrganizationResolver } from './organization.resolver';
import { Admin } from 'src/admin/entities/admin.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Organization, Admin, User]),   JwtModule.register({
    secret: 'your-secret-key', 
    signOptions: { expiresIn: '1h' },
  }), ConfigModule],
  providers: [OrganizationService, OrganizationResolver],
})
export class OrganizationModule {}
