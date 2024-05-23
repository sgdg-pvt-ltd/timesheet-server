import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateOrganizationDto {
  @Field()
  name: string;
}
