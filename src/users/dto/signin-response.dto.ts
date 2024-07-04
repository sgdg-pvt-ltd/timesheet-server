import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class SignInResponseDto {
  @Field()
  email: string;

  @Field()
  id: string;

  @Field(() => [String])
  organizationIds: string[];

  @Field()
  token: string;
}
