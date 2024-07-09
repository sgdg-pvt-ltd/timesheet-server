import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

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
  async findManyById(limit: number, offset: number): Promise<User[]> {
    console.log('abcd');  
    try {
       const response = await this.userRepository
         .createQueryBuilder("user")
         .where("user.id IN (:...ids)", { ids: Array.from({ length: limit }, (_, i) => String(offset + i)) })
         .getMany();
       console.log(response, 'response');
       return response;
    } catch (error) {
       console.error('Error executing query:', error);
       throw error; 
    }
   }
}
