import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Organization } from '../../organization/entities/organization.entity';
import { UserRole } from 'src/common/role';
import { UserOrganization } from 'src/organization/entities/userOrganization.entity';

@ObjectType()
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column({ nullable: true })
  @Field()
  username: string;

  @Column()
  @Field()
  email: string;

  @Column()
  @Field()
  password: string;

  @Column({ default: '' })
  @Field()
  resetToken: string;
  filter: any

  @Column({ nullable: true })
  @Field()
  organizationId: string; 
 
  @Column({ type: 'enum', enum: UserRole, default: UserRole.superAdmin })
  @Field(() => UserRole) 
  role: UserRole;

  @OneToMany(() => UserOrganization, userOrganization => userOrganization.user)
  userOrganizations: UserOrganization[];

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}
