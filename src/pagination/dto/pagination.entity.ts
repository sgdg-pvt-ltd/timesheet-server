import { Field, ObjectType, Int } from '@nestjs/graphql';

@ObjectType()
export class PageInfo {
  @Field(() => Int)
  count: number;

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalPages: number;
}
