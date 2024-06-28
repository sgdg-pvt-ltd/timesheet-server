import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OrganizationUsersDto {
  @Field()
  organizationName: string;

  @Field(() => [String])
  userEmails: string[];
}
