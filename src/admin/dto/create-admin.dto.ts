import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateAdminDto {
  @Field()
  username: string;

  @Field()
  password: string;
}
