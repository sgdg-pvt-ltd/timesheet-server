import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { OrganizationService } from './organization.service';
import { Organization } from './entities/organization.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Resolver(of => Organization)
export class OrganizationResolver {
  constructor(private readonly organizationService: OrganizationService) {}

  @Mutation(returns => Organization)
  createOrganization(@Args('createOrganizationDto') createOrganizationDto: CreateOrganizationDto): Promise<Organization> {
    return this.organizationService.create(createOrganizationDto);
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

  @Mutation(returns => Boolean)
  async removeOrganization(@Args('id') id: string): Promise<boolean> {
    await this.organizationService.remove(id);
    return true;
  }
}
