import { Field, ObjectType } from '@nestjs/graphql';
import { UserDetailsDto } from './user-details.dto';

@ObjectType()
export class OrganizationUsersDto {

  @Field()
  organizationId: string;

  @Field()
  organizationName: string;

  // @Field(() => [String])
  // userEmails: string[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [UserDetailsDto])
  userDetails: UserDetailsDto[];
}
