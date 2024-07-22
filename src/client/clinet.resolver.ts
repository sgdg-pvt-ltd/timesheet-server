import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Client } from './entities/client.entity';
import { ClientInput } from './dto/client-input';
import { ClientService } from './client.service';
import { AddProjectManagerDto, ProjectManagerResponse } from './dto/add-project-manager.dto';
import { UpdateClientInput } from './dto/update-client-input.dto';
import { PaginatedClients } from './dto/paginated-clients.dto';
import { PaginationArgs } from 'src/pagination/pagination.util';

@Resolver(() => Client)
export class ClientResolver {
  constructor(private readonly clientService: ClientService) { }

  @Mutation(() => Client)
  async createClient(@Args('adminId') userId: string, @Args('clientInput') clientInput: ClientInput): Promise<Client> {
    return this.clientService.create(userId, clientInput);
  }

  @Query(() => PaginatedClients)
  async clients(
    @Args('page', { type: () => Int, nullable: true }) page?: number,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
    @Args('query', { type: () => String, nullable: true }) query?: string,
    @Args('order', { type: () => String, nullable: true }) order?: string,
    @Args('sort', { type: () => String, nullable: true }) sort?: string,

  ): Promise<PaginatedClients> {
    const parsedQuery = query ? JSON.parse(query) : {};
    const paginationArgs: PaginationArgs = {
      page,
      limit,
      query: parsedQuery,
      order,
      sort: sort === 'ASC' || sort === 'DESC' ? sort : undefined,
    };

    const { data, pageInfo } = await this.clientService.findMany(paginationArgs);
    return { clients: data, pageInfo };
  }

  @Query(() => Client)
  async client(@Args('clientId') clientId: string): Promise<Client> {
    return this.clientService.findOne(clientId);
  }

  @Query(() => ProjectManagerResponse)
  async getProjectManger(@Args('clientId') clientId: string): Promise<ProjectManagerResponse> {
    return this.clientService.getProjectManger(clientId);
  }

  @Mutation(() => ProjectManagerResponse)
  async deleteProjectManager(
    @Args('clientId') clientId: string, @Args('projectManager') projectManager: string,
  ): Promise<ProjectManagerResponse> {
    return this.clientService.deleteProjectManager(clientId, projectManager);
  }

  @Mutation(() => Client)
  async updateClient(@Args('adminId') userId: string, @Args('clientId') clientId: string, @Args('clientInput') clientInput: UpdateClientInput): Promise<Client> {
    return this.clientService.update(userId, clientId, clientInput);
  }

  @Mutation(() => Client)
  async addProjectManager(
    @Args('adminId') userId: string,
    @Args('clientId') clientId: string,
    @Args('projectManager') projectManager: string,
  ): Promise<Client> {
    const addProjectManagerDto: AddProjectManagerDto = {  projectManager };
    return this.clientService.addProjectManager(userId, clientId, addProjectManagerDto);
  }

  @Mutation(() => Boolean)
  async removeClient(@Args('adminId') userId: string,@Args('clientId') clientId: string): Promise<boolean> {
    await this.clientService.remove(userId, clientId);
    return true;
  }
}
