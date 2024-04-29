import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => String)
  async user(@Args('id') id: string) {
    return this.userService.getById(id);
  }

//   @Mutation()
//   async updateUser(@Args('id') id: string, @Args('updateUserDto') updateUserDto: UpdateUserDto) {
//     return this.userService.update(id, updateUserDto);
//   }

//   @Mutation()
//   async deleteUser(@Args('id') id: string) {
//     return this.userService.delete(id);
//   }
}
