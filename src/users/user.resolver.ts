import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
// import { UpdateUserDto } from './dto/update-user.dto';
// import { UserLoader } from './user.loader';
import { User } from './entities/user.entity';
import { GraphQLInt, GraphQLString } from 'graphql';
import { PaginatedUsers } from './dto/paginated-users.dto';
import { PaginationArgs } from 'src/pagination/pagination.util';
// import { PaginatedUsers } from './dto/pagination.dto';

@Resolver()
export class UserResolver {
  constructor(
    // private readonly userLoader: UserLoader,
    private readonly userService: UserService,
  ) {}
  @Query(() => PaginatedUsers)
  async users(
    @Args('page', { type: () => Int, nullable: true }) page?: number,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
    @Args('query', { type: () => String, nullable: true }) query?: string,
    @Args('order', { type: () => String, nullable: true }) order?: string,
    @Args('sort', { type: () => String, nullable: true }) sort?: string,
  ): Promise<PaginatedUsers> {
    const parsedQuery = query ? JSON.parse(query) : {};
    const paginationArgs: PaginationArgs = {
      page,
      limit,
      query: parsedQuery,
      order,
      sort: sort === 'ASC' || sort === 'DESC' ? sort : undefined
    };

    const { data, pageInfo } = await this.userService.findMany(paginationArgs);
    return { users: data, pageInfo };
  }
}
