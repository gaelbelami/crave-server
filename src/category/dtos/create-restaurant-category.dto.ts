import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { Category } from "src/category/entities/category.entity";
import { CoreOutput } from "src/shared/dtos/output.dto";



@InputType()
export class CreateCategoryInput extends PickType(Category, ['name', 'coverImage']) { }


@ObjectType()
export class CreateCategoryOutput extends CoreOutput { }