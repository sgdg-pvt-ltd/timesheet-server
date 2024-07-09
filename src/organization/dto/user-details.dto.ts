import { Field, ObjectType } from '@nestjs/graphql';
import { UserRole } from 'src/common/role';

@ObjectType()
export class UserDetailsDto {
  @Field()
  email: string;

  @Field(() => UserRole) 
  role: UserRole

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
