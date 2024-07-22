import * as DataLoader from 'dataloader';
import { Repository, FindManyOptions } from 'typeorm';

export interface PaginationArgs {
  page?: number;
  limit?: number;
  query?: any;
  order?: string;
  sort?: 'ASC' | 'DESC';
}

export interface PageInfo {
  count: number;
  total: number;
  limit: number;
  currentPage: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pageInfo: PageInfo;
}

export function createPaginationLoader<T>(
  repository: Repository<T>,
  defaultOrder: string = 'createdAt',
  defaultSort: 'ASC' | 'DESC' = 'ASC',
) {
  return new DataLoader(async (keys: readonly string[]) => {
    const results: { [key: string]: PaginatedResult<T> } = {};

    for (const key of keys) {
      const [page, limit, query, order, sort] = key.split(',');

      const parsedPage = parseInt(page, 10) || 1;
      const parsedLimit = parseInt(limit, 10) || 10;
      const parsedQuery = query ? JSON.parse(query) : {};
      const parsedOrder = order || defaultOrder;
      const parsedSort = (sort && (sort === 'ASC' || sort === 'DESC') ? sort : defaultSort) as 'ASC' | 'DESC';

      const findOptions: FindManyOptions<T> = {
        where: parsedQuery,
        order: { [parsedOrder]: parsedSort } as any, 
        skip: (parsedPage - 1) * parsedLimit,
        take: parsedLimit,
      };

      const [data, total] = await repository.findAndCount(findOptions);

      const pageInfo: PageInfo = {
        count: data.length,
        total,
        limit: parsedLimit,
        currentPage: parsedPage,
        totalPages: Math.ceil(total / parsedLimit),
      };

      results[key] = { data, pageInfo };
    }

    return keys.map(key => results[key]);
  });
}
