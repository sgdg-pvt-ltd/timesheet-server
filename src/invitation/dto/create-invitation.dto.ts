import { InputType, Field } from '@nestjs/graphql';
import { UserRole } from 'src/common/enum/role';
import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

@InputType()
export class CreateInvitationDto {
  @Field()
  sendBy: string;

  @Field()
  email: string;

  @Field()
  organizationId: string;

  @Field(() => UserRole)
  role: UserRole;
 
}
