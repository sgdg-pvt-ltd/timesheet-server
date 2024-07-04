import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { ClientResolver } from './clinet.resolver';
import { ClientService } from './client.service';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client, User])],
  providers: [ClientResolver, ClientService],
})
export class ClientModule {}