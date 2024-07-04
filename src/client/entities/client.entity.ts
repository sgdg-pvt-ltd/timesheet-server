import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Projects } from 'src/project/entities/projects.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Client {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @OneToMany(() => Projects, (project) => project.masterProjectId)
  @Field(() => [Projects], { nullable: true })
  projectList: Projects[];

  @Column({ nullable: true })
  @Field({ nullable: true })
  organizationId?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  title?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  customerDisplayName?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  companyName?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  emailAddress?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  phoneNumber?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  mobileNumber?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  other?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  fax?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  website?: string;

  @Column({nullable: true})
  @Field({nullable: true})
  createdBy?: string

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;

  @DeleteDateColumn()
  @Field({ nullable: true })
  deletedAt?: Date;
}
