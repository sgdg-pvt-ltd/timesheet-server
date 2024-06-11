import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { InvitationService } from './invitation.service';
import { InvitationResponse } from './dto/invitation-response.dto';
import { UserRole } from 'src/common/role';
import { CreateInvitationDto } from './dto/create-invitation.dto';

@Resolver()
export class InvitationResolver {
  constructor(private readonly invitationService: InvitationService) {}

  @Mutation(() => InvitationResponse)
  async inviteUser(
    @Args('createInvitationInput') createInvitationDto: CreateInvitationDto
  ): Promise<InvitationResponse> {
    const { email, organizationId, role } = createInvitationDto;
    return this.invitationService.sendInvitation(email, organizationId, role);
  }
}


