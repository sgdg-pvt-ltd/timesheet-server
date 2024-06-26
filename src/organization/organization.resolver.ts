import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { OrganizationService } from './organization.service';
import { Organization } from './entities/organization.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { UserRole } from 'src/common/role';
import { SwitchUserOrganizationDto } from './dto/switch-user-organization.dto';

@Resolver(of => Organization)
export class OrganizationResolver {
  constructor(private readonly organizationService: OrganizationService) {}

  @Mutation(returns => Organization)
  createOrganization(@Args('createOrganizationDto') createOrganizationDto: CreateOrganizationDto,  @Args('userId') userId: string,): Promise<Organization> {
    return this.organizationService.create(createOrganizationDto, userId);
  }

  @Query(returns => [Organization])
  organizations(): Promise<Organization[]> {
    return this.organizationService.findAll();
  }

  @Query(returns => Organization)
  organization(@Args('id') id: string): Promise<Organization> {
    return this.organizationService.findOne(id);
  }

  @Mutation(returns => Organization)
  updateOrganization(@Args('updateOrganizationDto') updateOrganizationDto: UpdateOrganizationDto): Promise<Organization> {
    return this.organizationService.update(updateOrganizationDto.id, updateOrganizationDto);
  }

  @Mutation(() => Boolean)
  async softDeleteOrganization(
    @Args('id') id: string,
    @Args('adminId') adminId: string,
  ): Promise<boolean> {
    await this.organizationService.softDelete(id, adminId);
    return true;
  }

  @Mutation(() => String)
  async switchUserOrganization(
    @Args('switchUserOrganizationDto') switchUserOrganizationDto: SwitchUserOrganizationDto,
  ): Promise<string> {
    const { token } = await this.organizationService.switchUserOrganization(switchUserOrganizationDto);
    return token;
  }
}
