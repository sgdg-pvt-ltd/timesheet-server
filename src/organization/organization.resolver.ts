import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { OrganizationService } from './organization.service';
import { Organization } from './entities/organization.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { UserRole } from 'src/common/enum/role';
import { SwitchUserOrganizationDto } from './dto/switch-user-organization.dto';
import { OrganizationUsersDto } from './dto/user-organization-list.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/users/auth/jwt-auth.guard';

@Resolver(of => Organization)
export class OrganizationResolver {
  constructor(private readonly organizationService: OrganizationService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(returns => Organization)
  createOrganization(@Args('createOrganizationDto') createOrganizationDto: CreateOrganizationDto,  @Args('adminId') adminId: string,): Promise<Organization> {
    return this.organizationService.create(createOrganizationDto, adminId);
  }

  @UseGuards(JwtAuthGuard)
  @Query(returns => [Organization])
  organizations(): Promise<Organization[]> {
    return this.organizationService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Query(returns => Organization)
  organization(@Args('id') id: string): Promise<Organization> {
    return this.organizationService.findOne(id);
  }

  @Mutation(returns => Organization)
  updateOrganization(@Args('updateOrganizationDto') updateOrganizationDto: UpdateOrganizationDto): Promise<Organization> {
    return this.organizationService.update(updateOrganizationDto.id, updateOrganizationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => OrganizationUsersDto)
  async getSingleOrganizationWithUser(
    @Args('organizationId') organizationId: string,
  ): Promise<OrganizationUsersDto> {
    return this.organizationService.getSingleOrganizationWithUser(organizationId);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [OrganizationUsersDto])
  async getOrganizationsWithUsers(): Promise<OrganizationUsersDto[]> {
    return this.organizationService.getOrganizationsWithUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async softDeleteOrganization(
    @Args('id') id: string,
    @Args('adminId') adminId: string,
  ): Promise<boolean> {
    await this.organizationService.softDelete(id, adminId);
    return true;
  }
  
  @UseGuards(JwtAuthGuard)
  @Mutation(() => String)
  async switchUserOrganization(
    @Args('switchUserOrganizationDto') switchUserOrganizationDto: SwitchUserOrganizationDto,
  ): Promise<string> {
    const { token } = await this.organizationService.switchUserOrganization(switchUserOrganizationDto);
    return token;
  }
}
