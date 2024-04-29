import {Field, InputType} from '@nestjs/graphql';
import { ProjectInput } from 'src/project/dto/projects.input';


@InputType()
export class ClientInput {

    @Field({ nullable: true })
    clientName: string;

    @Field({ nullable: true })
    clientContact?: string;

    @Field(() => [ProjectInput],  { nullable: true })
    projectList: ProjectInput[];
}
