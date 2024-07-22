import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { UserRole } from 'src/common/enum/role';

@ObjectType()
export class ProjectOutput {
  @Field(() => ID)
  masterProjectId: string;

  @Field(() => UserRole)
  role?: UserRole;

  @Field()
  masterProjectName: string;

  @Field({nullable: true})
  projectDescription?: string;

  @Field({nullable: true})
  clientContact?: string;

  @Field(({nullable: true}))
  masterProjectBudget?: number;
}
