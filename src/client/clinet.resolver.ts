import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Client } from './entities/client.entity';
import { ClientInput } from './dto/client-input';
import { ClientService } from './client.service';

@Resolver(() => Client)
export class ClientResolver {
  constructor(private readonly clientService: ClientService) { }

  @Mutation(() => Client)
  async createClient(@Args('adminId') userId: string, @Args('clientInput') clientInput: ClientInput): Promise<Client> {
    return this.clientService.create(userId, clientInput);
  }

  @Query(() => [Client])
  async clients(): Promise<Client[]> {
    return this.clientService.findAll();
  }

  @Query(() => Client)
  async client(@Args('clientId') clientId: string): Promise<Client> {
    return this.clientService.findOne(clientId);
  }

  @Mutation(() => Client)
  async updateClient(@Args('adminId') userId: string, @Args('clientId') clientId: string, @Args('clientInput') clientInput: ClientInput): Promise<Client> {
    return this.clientService.update(userId, clientId, clientInput);
  }

  @Mutation(() => Boolean)
  async removeClient(@Args('adminId') userId: string,@Args('clientId') clientId: string): Promise<boolean> {
    await this.clientService.remove(userId, clientId);
    return true;
  }
}
