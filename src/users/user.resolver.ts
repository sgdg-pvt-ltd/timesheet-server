import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
// import { UpdateUserDto } from './dto/update-user.dto';
import { UserLoader } from './user.loader';
import { User } from './entities/user.entity';
import { GraphQLInt } from 'graphql';

@Resolver()
export class UserResolver {
  constructor(
    private readonly userLoader: UserLoader,
  ) {}

  @Query(() => [User])
  async users(
     @Args('limit', { type: () => GraphQLInt }) limit: number,
     @Args('offset', { type: () => GraphQLInt }) offset: number,
   ): Promise<User[]> {
     // Combine limit and offset into a single key for DataLoader
     const key = `${limit},${offset}`;
     const users = await this.userLoader.batchUsers.load(key);
     return users.filter(user => user !== null) as User[];
  }


}
