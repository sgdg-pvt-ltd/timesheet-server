import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, MinLength, Matches } from 'class-validator';

@InputType()
export class AcceptInvitationDto {
  @Field()
  @MinLength(8)
  password: string;

  @Field()
  @MinLength(8)
  @Matches('password')
  confirmPassword: string;
}
