import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserRole } from 'src/common/role';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@ObjectType()
@Entity()
export class Invitation {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Field()
  email: string;

  @Column()
  @Field()
  organizationId: string;

  @Column({ type: 'enum', enum: UserRole})
  @Field(() => UserRole) 
  role: UserRole;
}
