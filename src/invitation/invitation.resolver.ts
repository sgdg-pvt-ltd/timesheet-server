import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { InvitationService } from './invitation.service';
import { InvitationResponse } from './dto/invitation-response.dto';

@Resolver()
export class InvitationResolver {
  constructor(private readonly invitationService: InvitationService) {}

  @Mutation(returns => InvitationResponse)
  async inviteUser(
    @Args('email') email: string,
    @Args('organizationId') organizationId: string,
  ) {
    const result = await this.invitationService.sendInvitation(email, organizationId);
    return result;
  }
}


