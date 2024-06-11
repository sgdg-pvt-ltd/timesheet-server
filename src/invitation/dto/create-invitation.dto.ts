import { InputType, Field } from '@nestjs/graphql';
import { UserRole } from 'src/common/role';

@InputType()
export class CreateInvitationDto {
  @Field()
  email: string;

  @Field()
  organizationId: string;

  @Field(() => UserRole)
  role: UserRole;
}
