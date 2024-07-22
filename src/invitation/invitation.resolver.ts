import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { InvitationService } from './invitation.service';
import { InvitationResponse } from './dto/invitation-response.dto';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { User } from 'src/users/entities/user.entity';
import { AcceptInvitationDto } from './dto/accept-invitation.dto';

@Resolver()
export class InvitationResolver {
  constructor(private readonly invitationService: InvitationService) {}

  @Mutation(() => InvitationResponse)
  async inviteUser(
    @Args('createInvitationInput') createInvitationDto: CreateInvitationDto
  ): Promise<InvitationResponse> {
    const {sendBy, email, organizationId, role } = createInvitationDto;
    return this.invitationService.sendInvitation(sendBy, email, organizationId, role);
  }

  @Mutation(() => User)
  async acceptInvitation(
    @Args('acceptInvitationInput') acceptInvitationDto: AcceptInvitationDto,
    @Context() context
  ): Promise<User> {
    const token = context.req.headers.authorization.split(' ')[1]; 
    return this.invitationService.acceptInvitation(token, acceptInvitationDto);
  }
}


