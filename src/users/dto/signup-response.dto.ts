import { Field, ObjectType } from '@nestjs/graphql';
import { UserRole } from 'src/common/role';

@ObjectType()
export class SignupResponse {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field(() => UserRole)
  role: UserRole;
}
