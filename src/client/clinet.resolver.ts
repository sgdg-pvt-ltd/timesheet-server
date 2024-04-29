import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Client } from './entities/client.entity';
import { ClientInput } from './dto/client-input';
import { ClientService } from './client.service';

@Resolver(() => Client)
export class ClientResolver {
  constructor(private readonly clientService: ClientService) {}

  @Query(() => [Client])
  async clients(): Promise<Client[]> {
    return this.clientService.findAll();
  }

  @Query(() => Client)
  async client(@Args('clientId') clientId: string): Promise<Client> {
    return this.clientService.findOne(clientId);
  }
  
  @Mutation(() => Client)
  async createClient(@Args('clientInput') clientInput: ClientInput): Promise<Client> {
    return this.clientService.create(clientInput);
  }

  @Mutation(() => Client)
  async updateClient(@Args('clientId') clientId: string, @Args('clientInput') clientInput: ClientInput): Promise<Client> {
    return this.clientService.update(clientId, clientInput);
  }

  @Mutation(() => Boolean)
  async removeClient(@Args('clientId') clientId: string): Promise<boolean> {
    await this.clientService.remove(clientId);
    return true;
  }
}
