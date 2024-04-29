import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ProjectService } from './project.service';
import { ProjectInput } from './dto/projects.input';
import { ProjectOutput } from './dto/projects-output';

@Resolver()
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService) {}

  @Mutation(() => ProjectOutput)
  async createProject(@Args('data') data: ProjectInput): Promise<ProjectOutput> {
    try {
      return await this.projectService.createproject(data);
    } catch (error) {
      throw new Error(`Unable to create project: ${error.message}`);
    }
  }

  @Query(() => [ProjectOutput])
  async projects(): Promise<ProjectOutput[]> {
    try {
      return await this.projectService.findAll();
    } catch (error) {
      throw new Error(`Unable to fetch projects: ${error.message}`);
    }
  }

  @Query(() => ProjectOutput)
  async project(@Args('id') id: string): Promise<ProjectOutput> {
    try {
      return await this.projectService.findOne(id);
    } catch (error) {
      throw new Error(`Unable to fetch project: ${error.message}`);
    }
  }

  @Mutation(() => ProjectOutput)
  async updateProject(
    @Args('data') data: ProjectInput,
    @Args('id') id: string,
  ): Promise<ProjectOutput> {
    try {
      return await this.projectService.updateProject(data, id);
    } catch (error) {
      throw new Error(`Unable to update project: ${error.message}`);
    }
  }
}
