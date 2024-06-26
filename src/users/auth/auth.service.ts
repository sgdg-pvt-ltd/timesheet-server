import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { UserService } from '../user.service';
import { JwtService } from '@nestjs/jwt';
import { SigninInput } from '../dto/signin-dto';
import { SignupInput } from '../dto/sighnup-dto';
import { BcryptService } from '../../common/modules/bcrypt/bcrypt.service'
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ErrorMessage from 'src/common/error-message';
import { validateEmail, validatePassword } from 'src/validations/singup-validation.helper';
import { SignInResponseDto } from '../dto/signin-response.dto';
import { SignupResponse } from '../dto/signup-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private bcryptService: BcryptService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async validateUser(loginUserDto: SigninInput) {
    const user = await this.userService.findOne(loginUserDto.email.toLowerCase())
    if (!user) {
      throw new HttpException(ErrorMessage.EMAIL_NOT_FOUND,  HttpStatus.NOT_FOUND );
    }
    const passwordMatch = await this.bcryptService.comparePassword(loginUserDto.password, user.password);
    if (passwordMatch) {
      return user
    } else {
      throw new HttpException(ErrorMessage.PASSWORD_INCORRECT,  HttpStatus.NOT_FOUND );
    }
  }

  async login(loginUserDto: SigninInput): Promise<SignInResponseDto> {
    try {
      const user = await this.validateUser(loginUserDto);
      const payload = {
        email: user.email,
        id: user.id,
        organizationId: user.organizationId,

      };
      const accessToken = this.jwtService.sign(payload);
      const response: SignInResponseDto = {
        token: accessToken,
        email: user.email,
        id: user.id,
        organizationId: user.organizationId,
      };

      return response;
    } catch (error) {
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }

  async signUp(signUpInput: SignupInput): Promise<SignupResponse> {
    try {
      const { email, password, confirmPassword } = signUpInput;
      if (!( email && password)) {
        throw new HttpException(ErrorMessage.FILL_ALL_DATA, HttpStatus.BAD_REQUEST);
      }
      if (password !== confirmPassword) {
        throw new HttpException(ErrorMessage.PASSWORD_MISMATCH, HttpStatus.BAD_REQUEST);
      }
      if (!validateEmail(email)) {
        throw new HttpException(ErrorMessage.INVALID_EMAIL, HttpStatus.BAD_REQUEST);
      }
      const existingEmail = await this.userRepository.findOne({ where: { email: email.toLowerCase() } });
      if (existingEmail) {
        throw new HttpException(ErrorMessage.EMAIL_EXISTS, HttpStatus.BAD_REQUEST);
      }
      if (!validatePassword(password)) {
        throw new HttpException(ErrorMessage.INVALID_PASSWORD, HttpStatus.BAD_REQUEST);
      }
      const encryptPassword = await this.bcryptService.hashingPassword(password);
      const newUser = new User();
      newUser.email = email.toLowerCase();
      newUser.password = encryptPassword;
      const savedUser = await this.userRepository.save(newUser);
  
      const signupResponse = new SignupResponse();
      signupResponse.id = savedUser.id;
      signupResponse.email = savedUser.email;
      signupResponse.role = savedUser.role;
      return signupResponse;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error(error);
      throw new HttpException(
        { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Internal Server Error' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
}
}
