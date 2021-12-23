import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Restaurant } from "src/restaurants/entities/restaurant.entity";
import { Repository } from "typeorm";
import { AllCategoriesOutput } from "./dtos/all-categories.dto";
import { CategoryInput, CategoryOutput } from "./dtos/category.dto";
import { CreateCategoryInput, CreateCategoryOutput } from "./dtos/create-category.dto";
import { DeleteCategoryInput, DeleteCategoryOutput } from "./dtos/delete-category.dto";
import { EditCategoryInput, EditCategoryOutput } from "./dtos/edit-category.dto";
import { Category } from "./entities/category.entity";




@Injectable()
export class CategoryService {
    constructor(@InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
        @InjectRepository(Restaurant)
        private readonly restaurantRepository: Repository<Restaurant>) { }


    createCategoryName(name: string) {
        const categoryName = name.trim().toLocaleLowerCase();
        const categorySlug = categoryName.replace(/ /g, '-');
        return categorySlug
    }

    async createCategory({ name, coverImage }: CreateCategoryInput): Promise<CreateCategoryOutput> {
        try {
            const categorySlug = this.createCategoryName(name);
            let category = await this.categoryRepository.findOne({ slug: categorySlug });
            if (category) {
                return {
                    ok: false,
                    message: "Category already exists"
                }
            }
            await this.categoryRepository.save(this.categoryRepository.create({ slug: categorySlug, name, coverImage }));
            return {
                ok: true,
                message: "Restaurant Category created successfully",
            }

        } catch (error) {
            return { ok: false, message: "Could not create restaurant category" }
        }
    }

    async findByName(categoryName: string): Promise<Category> {
        try {
            const categorySlug = this.createCategoryName(categoryName);
            let category = await this.categoryRepository.findOne({ slug: categorySlug });
            return category;
        } catch (error) {

        }
    }


    async editCategory({ name, coverImage, categoryId }: EditCategoryInput): Promise<EditCategoryOutput> {
        try {

            const exists = this.categoryRepository.findOne(categoryId);
            if (!exists) {
                return {
                    ok: false,
                    message: "No category found"
                }
            }

            const categorySlug = this.createCategoryName(name);
            await this.categoryRepository.save([{
                id: categoryId,
                name,
                coverImage,
                slug: categorySlug,
            }])

            return {
                ok: true,
                message: "Category created successfully"
            }

        } catch (error) {
            return {
                ok: false,
                message: "Could not edit category"
            }
        }
    }

    async deleteCategory(deleteCategoryInput: DeleteCategoryInput): Promise<DeleteCategoryOutput> {
        try {
            const category = await this.categoryRepository.findOne(deleteCategoryInput.categoryId);
            if (!category) {
                return {
                    ok: false,
                    message: "Category not found"
                }
            }

            await this.categoryRepository.remove(category)

            return {
                ok: true,
                message: "Category deleted successfully"
            }
        } catch (error) {
            return {
                ok: false,
                message: "Could not delete category. Please try again later"
            }
        }
    }


    async allCategories(): Promise<AllCategoriesOutput> {
        try {
            const categories = await this.categoryRepository.find();
            return {
                ok: true,
                message: `${categories.length.toString()} categorie(s) found`,
                categories,
            }
        } catch (error) {
            return {
                ok: false,
                message: "Could not load categories"
            }
        }
    }

    async countRestaurants(category: Category): Promise<number> {
        return this.restaurantRepository.count({ category })
    }


    async findCategoryBySlug({ categorySlug, page }: CategoryInput): Promise<CategoryOutput> {
        try {
            const category = await this.categoryRepository.findOne({ slug: categorySlug });
            if (!category) {
                return {
                    ok: false,
                    message: "Category not found",
                }
            }
            const restaurants = await this.restaurantRepository.find(
                {
                    where: {
                        category,
                    },
                    take: 25,
                    skip: (page - 1) * 25,
                }
            )
            category.restaurants = restaurants;

            const totalResults = await this.countRestaurants(category);

            return {
                ok: true,
                category,
                totalPages: Math.ceil(totalResults / 25),
                restaurants,
            }
        } catch (error) {
            return {
                ok: false,
                message: "Could not load Category"
            }
        }
    }


}