import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { createPaginationLoader, PaginatedResult, PaginationArgs } from 'src/pagination/pagination.util';

@Injectable()
export class UserService {
  private userPaginationLoader;
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {  this.userPaginationLoader = createPaginationLoader<User>(this.userRepository);}

  async findOneById(id: string) {
    try {
      const user = await this.userRepository.findOne({where:{id}});
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findOne(email: string) {
    return await this.userRepository.findOne({where:{ email }});
  }

  
  async findMany(args: PaginationArgs): Promise<PaginatedResult<User>> {
    const key = [
      args.page,
      args.limit,
      args.query ? JSON.stringify(args.query) : '',
      args.order,
      args.sort,
    ].join(',');

    return this.userPaginationLoader.load(key);
  }
}
