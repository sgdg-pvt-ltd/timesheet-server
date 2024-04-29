
import { Field } from "@nestjs/graphql";
import { IsString, isString } from "class-validator";

export class UpdateUserDto {

  @IsString()
  @Field()
  username: string;
}
