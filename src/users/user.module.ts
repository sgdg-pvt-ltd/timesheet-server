import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BcryptModule } from '../common/modules/bcrypt/bcrypt.module'
import { User } from './entities/user.entity';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { UserLoader } from './user.loader';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), 
    BcryptModule,
    JwtModule
  ],
  providers: [UserService, UserResolver, UserLoader],
  exports: [UserService, UserResolver],
})
export class UserModule {}
