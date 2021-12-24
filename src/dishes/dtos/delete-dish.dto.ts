import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { CoreOutput } from "src/shared/dtos/output.dto";



@InputType()
export class DeleteDishInput {
    @Field(type => Number)
    dishId: number;
}


@ObjectType()
export class DeleteDishOutput extends CoreOutput { }