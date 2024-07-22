import { Field, ObjectType, Int } from '@nestjs/graphql';
import { Client } from '../entities/client.entity';
import { PageInfo } from 'src/pagination/dto/pagination.entity';


@ObjectType()
export class PaginatedClients {
  @Field(() => [Client])
  clients: Client[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}
