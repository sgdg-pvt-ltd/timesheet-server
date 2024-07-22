import { Field, ObjectType, Int } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { PageInfo } from 'src/pagination/dto/pagination.entity';

@ObjectType()
export class PaginatedUsers {
  @Field(() => [User])
  users: User[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}
