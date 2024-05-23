import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invitation } from './entities/invitation.entity';
import { InvitationService } from './invitation.service';
import { InvitationResolver } from './invitation.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Invitation])],
  providers: [InvitationService, InvitationResolver],
})
export class InvitationModule {}
