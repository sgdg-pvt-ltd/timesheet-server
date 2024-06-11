import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateAdminDto } from './create-admin.dto';

@InputType()
export class UpdateAdminDto extends PartialType(CreateAdminDto) {
  @Field({ nullable: true })
  username?: string;

  @Field({ nullable: true })
  password?: string;
}
