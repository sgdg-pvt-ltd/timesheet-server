import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AdminService } from './admin.service';
import { Admin } from './entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Resolver()
export class AdminResolver {
  constructor(private readonly adminService: AdminService) {}

  @Mutation(returns => Admin)
  createAdmin(@Args('createAdmin') createAdminDto: CreateAdminDto): Promise<Admin> {
    return this.adminService.create(createAdminDto);
  }

  @Query(returns => [Admin])
  findAllAdmins(): Promise<Admin[]> {
    return this.adminService.findAll();
  }

  @Query(returns => Admin)
  findOneAdmin(@Args('id') id: string): Promise<Admin> {
    return this.adminService.findOne(id);
  }

  @Mutation(returns => Admin)
  updateAdmin(
    @Args('id') id: string,
    @Args('updateAdmin') updateAdminDto: UpdateAdminDto,
  ): Promise<Admin> {
    return this.adminService.update(id, updateAdminDto);
  }

  @Mutation(returns => Boolean)
  removeAdmin(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    return this.adminService.remove(id).then(() => true);
  }
}
