import { Field, InputType, ObjectType, PartialType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/shared/dtos/output.dto";
import { Dish } from "../entities/dish.entity";



@InputType()
export class EditDishInput extends PickType(PartialType(Dish), ['name', 'options', 'price', 'description', 'photo']) {
    @Field(type => Number)
    dishId: number;
}


@ObjectType()
export class EditDishOutput extends CoreOutput { }