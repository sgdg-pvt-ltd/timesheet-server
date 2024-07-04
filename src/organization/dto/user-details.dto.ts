import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserDetailsDto {
  @Field()
  email: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
