import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { ClientResolver } from './clinet.resolver';
import { ClientService } from './client.service';

@Module({
  imports: [TypeOrmModule.forFeature([Client])],
  providers: [ClientResolver, ClientService],
})
export class ClientModule {}