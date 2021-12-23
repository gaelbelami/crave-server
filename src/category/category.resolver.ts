import { Args, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { RestaurantService } from "src/restaurants/restaurants.service";
import { CategoryService } from "./category.service";
import { AllCategoriesOutput } from "./dtos/all-categories.dto";
import { CategoryInput, CategoryOutput } from "./dtos/category.dto";
import { CreateCategoryInput, CreateCategoryOutput } from "./dtos/create-category.dto";
import { DeleteCategoryInput, DeleteCategoryOutput } from "./dtos/delete-category.dto";
import { EditCategoryInput, EditCategoryOutput } from "./dtos/edit-category.dto";
import { Category } from "./entities/category.entity";



@Resolver(of => Category)
export class CategoryResolver {
    constructor(
        private readonly categoryService: CategoryService,
        private readonly restaurantService: RestaurantService,) { }

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


    // Dynamic field: Not on the database
    @ResolveField(type => Number)
    restaurantCount(@Parent() category: Category): Promise<number> {
        return this.categoryService.countRestaurants(category);
    }


    @Query(returns => AllCategoriesOutput)
    async allCategories(): Promise<AllCategoriesOutput> {
        return this.categoryService.allCategories()
    }


    @Query(returns => CategoryOutput)
    category(@Args('categoryInput') categoryInput: CategoryInput): Promise<CategoryOutput> {
        return this.categoryService.findCategoryBySlug(categoryInput);
    }






}