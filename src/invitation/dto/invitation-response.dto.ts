import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Invitation } from '../entities/invitation.entity';

@ObjectType()
export class InvitationResponse {
  @Field(() => Invitation)
  invitation: Invitation;


}
