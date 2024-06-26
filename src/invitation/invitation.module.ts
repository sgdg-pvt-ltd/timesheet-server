import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invitation } from './entities/invitation.entity';
import { InvitationService } from './invitation.service';
import { InvitationResolver } from './invitation.resolver';
import { MailerModule } from 'src/mailer/mail.module';
import { ConfigModule } from '@nestjs/config';
import { Organization } from 'src/organization/entities/organization.entity';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Invitation, Organization, User]), MailerModule, ConfigModule, JwtModule],
  providers: [InvitationService, InvitationResolver],
})
export class InvitationModule {}
