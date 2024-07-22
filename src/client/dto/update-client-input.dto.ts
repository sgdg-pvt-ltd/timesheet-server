import { Field, InputType } from '@nestjs/graphql';
import { ClientTitle } from 'src/common/enum/role';

@InputType()
export class UpdateClientInput {

    createdBy?: string

    organizationId?: string;

    @Field(() => ClientTitle, {nullable: true}) 
    title?: ClientTitle;

    @Field({ nullable: true })
    state?: string;

    @Field({ nullable: true })
    customerDisplayName?: string;

    @Field({ nullable: true })
    companyName?: string;

    @Field({ nullable: true })
    emailAddress?: string;

    @Field({ nullable: true })
    mobileNumber?: string;

    @Field({ nullable: true })
    other?: string;

    @Field({ nullable: true })
    website?: string;

    @Field(() => [String], { nullable: true })
    projectManagers?: string[];
}
