import {Field, InputType} from '@nestjs/graphql';

@InputType()
export class ClientInput {

    createdBy?: string 

    organizationId?: string;

    @Field({ nullable: true })
    title?: string;

    @Field({ nullable: true })
    firstName?: string;

    @Field({ nullable: true })
    lastName?: string;

    @Field({ nullable: true })
    customerDisplayName?: string;

    @Field({ nullable: true })
    companyName?: string;

    @Field({ nullable: true })
    emailAddress?: string;

    @Field({ nullable: true })
    phoneNumber?: string;

    @Field({ nullable: true })
    mobileNumber?: string;

    @Field({ nullable: true })
    other?: string;

    @Field({ nullable: true })
    fax?: string;

    @Field({ nullable: true })
    website?: string;

}
