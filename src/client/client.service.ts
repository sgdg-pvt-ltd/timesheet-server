import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { ClientInput } from './dto/client-input';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {}

  async create(clientInput: ClientInput): Promise<Client> {
    const newClient = this.clientRepository.create(clientInput);
    return this.clientRepository.save(newClient);
  }

  async findAll(): Promise<Client[]> {
    return this.clientRepository.find();
  }
  async findOne(clientId: string): Promise<Client> {
    return this.clientRepository.findOne({ where: { clientId } });
  }

  async update(clientId: string, clientInput: ClientInput): Promise<Client> {
    const clientToUpdate = await this.clientRepository.findOne({ where: { clientId } });
    if (!clientToUpdate) {
      throw new Error(`Client with id ${clientId} not found`);
    }
    Object.assign(clientToUpdate, clientInput);
    await this.clientRepository.save(clientToUpdate);
    return clientToUpdate;
  }
  
  async remove(clientId: string): Promise<void> {
    await this.clientRepository.delete(clientId);
  }
}
