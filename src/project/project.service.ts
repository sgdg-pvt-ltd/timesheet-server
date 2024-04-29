import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Projects } from './entities/projects.entity';
import { ProjectInput } from './dto/projects.input';
import { ProjectOutput } from './dto/projects-output';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Projects)
    private readonly projectRepository: Repository<Projects>,
  ) {}

  async createproject(data: ProjectInput): Promise<ProjectOutput> {
    const { masterProjectName } = data;
    const findProject = await this.projectRepository.findOne({ where: { masterProjectName } });

    if (findProject) {
      throw new Error('Project already exists');
    }
    const project = this.projectRepository.create(data);
    return this.projectRepository.save(project);
  }


//   async createProject(input: ProjectInput): Promise<Client> {
//     const masterProject = await this.projectRepository.create(input.masterProjectId);
//     const client = await this.clientRepository.findOne(input.clientId);
//     client.projectList = [...(client.projectList || []), masterProject.id];
//     return this.clientRepository.save(client);
// }

  async findAll(): Promise<ProjectOutput[]> {
    return this.projectRepository.find();
  }

  async findOne(masterProjectId: string): Promise<ProjectOutput> {
    const project = await this.projectRepository.findOne({ where: { masterProjectId } });
    if (!project) {
      throw new Error('Project not found');
    }
    return project;
  }

  async updateProject(data: ProjectInput, masterProjectId: string): Promise<ProjectOutput> {
    const project = await this.projectRepository.findOne({ where: { masterProjectId } });
    if (!project) {
      throw new Error('Project not found');
    }
    const updatedProject = Object.assign(project, data);
    return this.projectRepository.save(updatedProject);
}
}