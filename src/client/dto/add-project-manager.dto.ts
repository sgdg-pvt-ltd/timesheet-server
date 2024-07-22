import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class AddProjectManagerDto {
  @Field()
  projectManager: string; 
}

@ObjectType()
export class ProjectManagerResponse {

  @Field()
  id: string
  
  @Field(() => [String])
  projectManagers: string[];
}
