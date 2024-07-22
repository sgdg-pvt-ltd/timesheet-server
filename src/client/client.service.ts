import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { ClientInput } from './dto/client-input';
import { User } from 'src/users/entities/user.entity';
import { UserRole } from 'src/common/role';
import ErrorMessage from 'src/common/error-message';
import { UpdateClientInput } from './dto/update-client-input.dto';
import { AddProjectManagerDto, ProjectManagerResponse } from './dto/add-project-manager.dto';
import { createPaginationLoader, PaginatedResult, PaginationArgs } from 'src/pagination/pagination.util';

@Injectable()
export class ClientService {
  private clientPaginationLoader;
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {this.clientPaginationLoader = createPaginationLoader<Client>(this.clientRepository); }

  private async getCurrentUser(userId: string): Promise<User> {
    return this.userRepository.findOne({ where: { id: userId } });
  }

  async create(userId: string, clientInput: ClientInput): Promise<Client> {
    const currentUser = await this.getCurrentUser(userId);
    if (!currentUser) {
      throw new HttpException(ErrorMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    if (
      currentUser.role !== UserRole.superAdmin &&
      currentUser.role !== UserRole.masterAdmin
    ) {
      throw new HttpException(ErrorMessage.SUPERADMIN_MASTERADMIN_PERMISSION, HttpStatus.NOT_ACCEPTABLE);
    }

    const clientExists =  await this.clientRepository.findOne({where:{companyName: clientInput.companyName}})
    if(clientExists) throw new HttpException("Company name already exist please enter new company name", HttpStatus.BAD_REQUEST)
    // clientInput['organizationId'] = currentUser.organizationId;
    // clientInput['createdBy'] = currentUser.id;
    clientInput.organizationId = currentUser.organizationId;
    clientInput.createdBy = currentUser.id

    const newClient = this.clientRepository.create(clientInput);
    return this.clientRepository.save(newClient);
  }

  async findMany(args: PaginationArgs): Promise<PaginatedResult<Client>> {
    const key = [
      args.page,
      args.limit,
      args.query ? JSON.stringify(args.query) : '',
      args.order,
      args.sort,
    ].join(',');

    return this.clientPaginationLoader.load(key);
  }

  async getProjectManger(clientId: string): Promise<ProjectManagerResponse> {
    const client = await this.clientRepository.findOne({ where: { id: clientId } });
    if (!client) throw new HttpException('Client not found', HttpStatus.NOT_FOUND);
  
    return {id: client.id, projectManagers: client.projectManagers };
  }

  async deleteProjectManager(clientId: string, projectManager: string): Promise<ProjectManagerResponse> {
    const client = await this.clientRepository.findOne({ where: { id: clientId } });
    if (!client) throw new HttpException('Client not found', HttpStatus.NOT_FOUND);

    const managerIndex = client.projectManagers.indexOf(projectManager);
    if (managerIndex === -1) {
      throw new HttpException('Project manager not found', HttpStatus.NOT_FOUND);
    }

    client.projectManagers.splice(managerIndex, 1);
    await this.clientRepository.save(client);

    return { id: client.id, projectManagers: client.projectManagers };
  }

  async findOne(clientId: string): Promise<Client> {
    return this.clientRepository.findOne({ where: { id: clientId } });
  }

  async update(userId: string, clientId: string, clientInput:UpdateClientInput ): Promise<Client> {
    const currentUser = await this.getCurrentUser(userId);
    if (!currentUser) {
      throw new HttpException(ErrorMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (
      currentUser.role !== UserRole.superAdmin &&
      currentUser.role !== UserRole.masterAdmin
    ) {
      throw new HttpException('Only Super Admin or Master Admin can update clients', HttpStatus.NOT_ACCEPTABLE);
    }
    const clientToUpdate = await this.clientRepository.findOne({ where: { id: clientId } });
    if (!clientToUpdate) {
      throw new HttpException(`Client with id ${clientId} not found`, HttpStatus.NOT_FOUND);
    }
    Object.assign(clientToUpdate, clientInput);
    await this.clientRepository.save(clientToUpdate);
    return clientToUpdate;
  }

  async addProjectManager(userId: string, clientId: string, addProjectManagerDto: AddProjectManagerDto): Promise<Client> {
    const currentUser = await this.getCurrentUser(userId);
    if (!currentUser) {
      throw new HttpException(ErrorMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (
      currentUser.role !== UserRole.superAdmin &&
      currentUser.role !== UserRole.masterAdmin
    ) {
      throw new HttpException(
        'Only Super Admin or Master Admin can add project manager', HttpStatus.FORBIDDEN,
      );
    }

    const client = await this.clientRepository.findOne({
      where: { id: clientId },
    });


    if (!client) {
      throw new HttpException(`Client with id ${clientId} not found`, HttpStatus.NOT_FOUND);
    }

    if (!client.projectManagers) {
      client.projectManagers = [];
    }

    const isDuplicate = client.projectManagers.some(
      pm => pm === addProjectManagerDto.projectManager,
    );

    if (isDuplicate) {
      throw new HttpException(
        `Project manager with name ${addProjectManagerDto.projectManager} already exists`,
        HttpStatus.CONFLICT,
      );
    }

    client.projectManagers.push(addProjectManagerDto.projectManager);
    await this.clientRepository.save(client);

    return client;
  }

  async remove(userId: string, clientId: string): Promise<void> {
    const currentUser = await this.getCurrentUser(userId);
    if (!currentUser) {
      throw new HttpException(ErrorMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    if (
      currentUser.role !== UserRole.superAdmin &&
      currentUser.role !== UserRole.masterAdmin
    ) {
      throw new HttpException(
        'Only Super Admin or Master Admin can delete clients', HttpStatus.FORBIDDEN,
      );
    }
    await this.clientRepository.softDelete(clientId);
  }
}
