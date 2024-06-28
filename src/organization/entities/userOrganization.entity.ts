import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Organization } from './organization.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { UserRole } from 'src/common/role';

@ObjectType()
@Entity()
export class UserOrganization {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @ManyToOne(() => User, user => user.userOrganizations)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Organization, organization => organization.userOrganizations)
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @Column()
  organizationId: string;

  @Column({ type: 'enum', enum: UserRole })
  @Field(() => UserRole)
  role: UserRole;
}