import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class InvitationResponse {
  @Field()
  email: string;

  @Field(() => Int)
  organizationId: string;
}