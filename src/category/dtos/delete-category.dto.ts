import { Field, InputType, ObjectType, PartialType } from "@nestjs/graphql";
import { CoreOutput } from "src/shared/dtos/output.dto";

@InputType()
export class DeleteCategoryInput {
    @Field(type => Number)
    categoryId: number
}


@ObjectType()
export class DeleteCategoryOutput extends CoreOutput { }