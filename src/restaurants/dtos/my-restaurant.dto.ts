import { Field, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/shared/dtos/output.dto";
import { Restaurant } from "../entities/restaurant.entity";


export class MyRestaurantInput extends PickType(Restaurant, ['id']){}


export class MyRestaurantOutput extends CoreOutput {
    @Field(type => Restaurant, { nullable: true})
    restaurant?: Restaurant;
}