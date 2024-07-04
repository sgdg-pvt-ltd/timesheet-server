import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { ClientInput } from './dto/client-input';
import { User } from 'src/users/entities/user.entity';
import { UserRole } from 'src/common/role';
import ErrorMessage from 'src/common/error-message';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

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
    // clientInput['organizationId'] = currentUser.organizationId;
    // clientInput['createdBy'] = currentUser.id;
    clientInput.organizationId = currentUser.organizationId;
    clientInput.createdBy = currentUser.id

    const newClient = this.clientRepository.create(clientInput);
    return this.clientRepository.save(newClient);
  }

  async findAll(): Promise<Client[]> {
    return this.clientRepository.find();
  }
  async findOne(clientId: string): Promise<Client> {
    return this.clientRepository.findOne({ where: { id: clientId } });
  }

  async update(userId: string, clientId: string, clientInput: ClientInput): Promise<Client> {
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
