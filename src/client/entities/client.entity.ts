import {Field, ID, ObjectType} from '@nestjs/graphql';
import { Projects } from 'src/project/entities/projects.entity';
import { Column, Entity, PrimaryGeneratedColumn,PrimaryColumn, OneToMany } from 'typeorm';


@Entity()
@ObjectType()
export class Client {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => ID)
    clientId: string;

    @Column({nullable: true})
    @Field()
    clientName?: string;

    @Column({nullable: true})
    @Field()
    clientContact?: string;

    @OneToMany(() => Projects, (project) => project.masterProjectId)
    @Field(() => [Projects],  { nullable: true })
    projectList: Projects[];
}
