import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignupInput } from '../dto/sighnup-dto';
import { SigninInput } from '../dto/signin-dto';
import { User } from '../entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  
  @UseGuards(LocalAuthGuard)
  @Mutation(() => String)
  async signIn(@Args('signInInput') SignInInput: SigninInput ) {
    const { access_token } = await this.authService.login(SignInInput);
    return access_token;
  }
  @Mutation(() => User)
  async signUp(
    @Args('signUpInput') signUpInput: SignupInput) {
    return this.authService.signUp(signUpInput);
  }
  
}
