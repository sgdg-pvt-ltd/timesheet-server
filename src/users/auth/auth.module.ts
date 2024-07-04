import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { BcryptService } from '../../common/modules/bcrypt/bcrypt.service';
import { User} from '../entities/user.entity';
import { UserModule } from '../user.module';
import { UserService } from '../user.service';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthResolver } from './auth.resolver';
import { UserOrganization } from 'src/organization/entities/userOrganization.entity';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '2h' },
    }),
    TypeOrmModule.forFeature([User, UserOrganization]),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, BcryptService, UserService ,AuthResolver],
  exports: [AuthService],
})
export class AuthModule {}
