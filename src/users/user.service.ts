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

  async getById(id: string) {
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

  async findManyById(usersId: string[]) {
    return await this.userRepository
      .createQueryBuilder()
      .select('username')
      .where('id IN (:...ids)', { ids: usersId })
      .getMany();
  }

//   async update(id: string, updateUserDto: UpdateUserDto) {
//     await this.userRepository.update(
//       { id },
      
//          {
//           username: updateUserDto.username,
//         },
      
//     );

//     const updatedUser = await this.getById(id);
//     return {username: updatedUser.username, }
//   }

//   async delete(id: string) {
//     return await this.userRepository.delete(id);
//   }
}
