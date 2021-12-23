import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Restaurant } from "src/restaurants/entities/restaurant.entity";
import { CoreOutput } from "src/shared/dtos/output.dto";
import { PaginationInput, PaginationOutput } from "src/shared/dtos/pagination.dto";
import { Category } from "../entities/category.entity";



@InputType()
export class CategoryInput extends PaginationInput {
    @Field(type => String)
    categorySlug: string;

}

@ObjectType()
export class CategoryOutput extends PaginationOutput {
    @Field(type => Category, { nullable: true })
    category?: Category;

    @Field(type => [Restaurant], { nullable: true })
    restaurants?: Restaurant[];
}