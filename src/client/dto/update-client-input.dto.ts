import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateClientInput {

    createdBy?: string

    organizationId?: string;

    @Field({ nullable: true })
    title?: string;

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
