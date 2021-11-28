import { ArgsType, Field } from "@nestjs/graphql";



@ArgsType()
export class CreateRestaurantDto {
    @Field(returns => String )
    name: string;

    @Field(returns => Boolean, {nullable: true})
    isVegan?: boolean;
    
    @Field(returns => String)
    address: string;
    
    @Field(returns => String)
    ownersName: string;
    
}