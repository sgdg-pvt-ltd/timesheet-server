import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Organization } from '../../organization/entities/organization.entity';
import { UserRole } from 'src/common/role';

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

  @Column()
  @Field()
  organizationId: string; 
 
  @Column({ type: 'enum', enum: UserRole})
  @Field(() => UserRole) 
  role: UserRole;

  @Field(() => Organization)
  @ManyToOne(() => Organization, organization => organization.users)
  organization?: Organization; 

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}
