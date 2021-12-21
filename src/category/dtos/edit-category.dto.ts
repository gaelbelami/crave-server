import { Field, InputType, ObjectType, PartialType } from "@nestjs/graphql";
import { CoreOutput } from "src/shared/dtos/output.dto";
import { CreateCategoryInput } from "./create-category.dto";




@InputType()
export class EditCategoryInput extends PartialType(CreateCategoryInput) {
    @Field(type => Number)
    categoryId: number;
}

@ObjectType()
export class EditCategoryOutput extends CoreOutput { }