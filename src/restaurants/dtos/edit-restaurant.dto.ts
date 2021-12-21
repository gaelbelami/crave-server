import { Field, InputType, ObjectType, PartialType } from "@nestjs/graphql";
import { CoreOutput } from "src/shared/dtos/output.dto";
import { CreateRestaurantInput } from "./create-restaurant.dto";



@InputType()
export class EditRestaurantInput extends PartialType(CreateRestaurantInput) {
    @Field(type => Number)
    restaurantId: number;
}


@ObjectType()
export class EditRestaurantOutput extends CoreOutput {
    // @Field(returns => Number)
    // id: number;

    // @Field(type => EditRestaurantInput)
    // data: EditRestaurantInput
}