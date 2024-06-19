import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignupInput } from '../dto/sighnup-dto';
import { SigninInput } from '../dto/signin-dto';
import { User } from '../entities/user.entity';
import { SignInResponseDto } from '../dto/signin-response.dto';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  
  @Mutation(() => SignInResponseDto)
  async signIn(@Args('signInInput') signInInput: SigninInput): Promise<SignInResponseDto> {
    try {
      return await this.authService.login(signInInput);
    } catch (error) {
      throw new Error(`Failed to sign in: ${error.message}`);
    }
  }
  @Mutation(() => User)
  async signUp(
    @Args('signUpInput') signUpInput: SignupInput) {
    return this.authService.signUp(signUpInput);
  }
  
}
