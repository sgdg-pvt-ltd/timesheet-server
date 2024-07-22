import { Field, InputType } from '@nestjs/graphql';
import { ClientTitle } from 'src/common/enum/role';

@InputType()
export class ClientInput {

    createdBy?: string

    organizationId?: string;

    @Field(() => ClientTitle, {nullable: true}) 
    title?: ClientTitle;

    @Field({ nullable: true })
    state?: string;

    @Field()
    customerDisplayName: string;

    @Field()
    companyName: string;

    @Field()
    emailAddress: string;

    @Field()
    mobileNumber: string;

    @Field({ nullable: true })
    other?: string;

    @Field({ nullable: true })
    website?: string;

    @Field(() => [String], )
    projectManagers: string[];

}
