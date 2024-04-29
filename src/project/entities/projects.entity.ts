import {Field, ID, ObjectType} from '@nestjs/graphql';
import { UserRole } from 'src/common/role';
import { Column, Entity, PrimaryGeneratedColumn,PrimaryColumn, OneToMany } from 'typeorm';


@Entity()
@ObjectType()
export class Projects {
    @PrimaryGeneratedColumn('uuid')
    @PrimaryColumn('uuid')
    @Field(() => ID)
    masterProjectId: string;

    @Column({type: 'enum', enum: UserRole})
    @Field()
    role?: UserRole;

    @Column()
    @Field()
    masterProjectName: string;
    
    @Column({nullable: true})
    @Field()
    projectDescription?: string;

    @Column({nullable: true})
    @Field()
    clientContact?: string;

    @Column({nullable: true})
    @Field()
    masterProjectBudget?: number;

    // @OneToMany(() => UnitProject, unitProject => unitProject.id)
    // @Field(() => [UnitProject])
    // unitProject?: UnitProject[];
}
