import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { CoreOutput } from "src/shared/dtos/output.dto";



@InputType()
export class DeleteRestaurantInput {
    @Field(type => Number)
    restaurantId: number;
}


@ObjectType()
export class DeleteRestaurantOutput extends CoreOutput { }