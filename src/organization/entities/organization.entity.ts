import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, DeleteDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@ObjectType()
@Entity()
export class Organization {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field(() => [User], { nullable: 'itemsAndList' })
  @OneToMany(() => User, user => user.organization, { nullable: true })
  users: User[];

  @Field({ nullable: true })
  @DeleteDateColumn()
  deletedAt?: Date;
}
