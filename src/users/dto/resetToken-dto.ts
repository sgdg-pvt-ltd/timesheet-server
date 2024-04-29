import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class ResetPasswordResponse {
  @Field({nullable: true})
  token: string;
}