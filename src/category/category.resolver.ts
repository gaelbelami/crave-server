import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { CategoryService } from "./category.service";
import { CreateCategoryInput, CreateCategoryOutput } from "./dtos/create-restaurant-category.dto";
import { Category } from "./entities/category.entity";



@Resolver(of => Category)
export class CategoryResolver {
    constructor(private readonly categoryService: CategoryService) { }

    @Mutation(returns => CreateCategoryOutput)
    async createCategory(@Args('createCategoryInput') createCategoryInput: CreateCategoryInput): Promise<CreateCategoryOutput> {
        return this.categoryService.createCategory(createCategoryInput);
    }
}