import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class SignInResponseDto {
  @Field()
  email: string;

  @Field()
  id: string;

  @Field({nullable: true})
  organizationId: string;

  @Field()
  token: string;
}
