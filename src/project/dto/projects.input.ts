import { InputType, Field } from '@nestjs/graphql';
import { UserRole } from 'src/common/role';

@InputType()
export class ProjectInput {
  @Field()
  masterProjectName: string;

  @Field(() => UserRole)
  role: UserRole;

  @Field({nullable: true})
  projectDescription?: string;
  
  @Field({nullable: true})
  clientContact?: string;

  @Field(({nullable: true}))
  masterProjectBudget?: number;
}
