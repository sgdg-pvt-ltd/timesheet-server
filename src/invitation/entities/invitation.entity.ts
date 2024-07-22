import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserRole } from 'src/common/role';
import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, DeleteDateColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Invitation {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column()
  @Field()
  sendBy: string;

  @Column()
  @Field()
  email: string;

  @Column()
  @Field()
  organizationId: string;

  @Column({ type: 'enum', enum: UserRole})
  @Field(() => UserRole) 
  role: UserRole;

  @Field({ nullable: true })
  @DeleteDateColumn()
  deletedAt?: Date;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}
