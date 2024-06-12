import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Organization } from '../../organization/entities/organization.entity';

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
  organizationId: string; // Added field for organization ID

  @Column()
  @Field()
  role: string; // Added field for user role

  @Field(() => Organization)
  @ManyToOne(() => Organization, organization => organization.users)
  organization?: Organization; // Optional since it's now also stored as organizationId

  // Other fields...
}
