import { InputType, Field } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class SwitchUserOrganizationDto {
  @Field()
  @IsUUID()
  userId: string;

  @Field()
  @IsUUID()
  organizationId: string;
}
