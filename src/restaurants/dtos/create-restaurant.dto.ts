import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/shared/dtos/output.dto";
import { Restaurant } from "../entities/restaurant.entity";



@InputType()
export class CreateRestaurantInput extends PickType(Restaurant, ['name', 'coverImage', 'address']) {
    @Field(type => String)
    categoryName: string;
}


@ObjectType()
export class CreateRestaurantOutput extends CoreOutput { 
    @Field(type => Number)
    restaurantId?: number;
}