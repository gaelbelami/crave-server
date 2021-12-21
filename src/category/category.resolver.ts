import { Query } from "@nestjs/common";
import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { CategoryService } from "./category.service";
import { CreateCategoryInput, CreateCategoryOutput } from "./dtos/create-category.dto";
import { DeleteCategoryInput, DeleteCategoryOutput } from "./dtos/delete-category.dto";
import { EditCategoryInput, EditCategoryOutput } from "./dtos/edit-category.dto";
import { Category } from "./entities/category.entity";



@Resolver(of => Category)
export class CategoryResolver {
    constructor(private readonly categoryService: CategoryService) { }

    @Mutation(returns => CreateCategoryOutput)
    async createCategory(@Args('createCategoryInput') createCategoryInput: CreateCategoryInput): Promise<CreateCategoryOutput> {
        return this.categoryService.createCategory(createCategoryInput);
    }

    @Mutation(returns => EditCategoryOutput)
    async editCategory(@Args('editCategoryInput') editCategoryInput: EditCategoryInput): Promise<EditCategoryOutput> {
        return this.categoryService.editCategory(editCategoryInput);
    }

    @Mutation(returns => DeleteCategoryOutput)
    async deleteCategory(@Args('deleteCategoryInput') deleteCategoryInput: DeleteCategoryInput): Promise<DeleteCategoryOutput> {
        return this.categoryService.deleteCategory(deleteCategoryInput);
    }



}