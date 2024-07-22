import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ClientTitle } from 'src/common/enum/role';
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
  @Field(() => [Projects],  { nullable: true })
  projectList: Projects[];

  @Column()
  @Field()
  organizationId?: string;

  @Column({type: 'enum', enum: ClientTitle, nullable: true})
  @Field(() => ClientTitle, {nullable: true}) 
  title?: ClientTitle

  @Column({nullable: true})
  @Field({nullable: true})
  state?: string;

  @Column()
  @Field()
  customerDisplayName: string;

  @Column()
  @Field()
  companyName: string;

  @Column("simple-array")
  @Field(() => [String], )
  projectManagers: string[];

  @Column()
  @Field()
  emailAddress: string;

  @Column()
  @Field()
  mobileNumber: string;

  @Column({nullable: true})
  @Field({nullable: true})
  other?: string;


  @Column({nullable:true})
  @Field({nullable: true})
  website?: string;

  @Column()
  @Field()
  createdBy: string

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;

  @DeleteDateColumn()
  @Field({nullable: true})
  deletedAt?: Date;
}
