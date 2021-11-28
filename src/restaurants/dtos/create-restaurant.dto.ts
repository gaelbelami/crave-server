import { ArgsType, Field } from "@nestjs/graphql";
import { IsBoolean, IsString, Length } from "class-validator";



@ArgsType()
export class CreateRestaurantDto {
    @Field(returns => String )
    @IsString()
    @Length(5,10)
    name: string;

    @Field(returns => Boolean, {nullable: true})
    @IsBoolean()
    isVegan?: boolean;
    
    @Field(returns => String)
    @IsString()
    address: string;
    
    @Field(returns => String)
    @IsString()
    @Length(5,10)
    ownersName: string;
    
}