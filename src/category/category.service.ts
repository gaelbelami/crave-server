import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateCategoryInput, CreateCategoryOutput } from "./dtos/create-restaurant-category.dto";
import { Category } from "./entities/category.entity";




@Injectable()
export class CategoryService {
    constructor(@InjectRepository(Category) private readonly categoryRepository: Repository<Category>) { }

    async createCategory({ name, coverImage }: CreateCategoryInput): Promise<CreateCategoryOutput> {
        try {
            const categoryName = name.trim().toLocaleLowerCase();
            const categorySlug = categoryName.replace(/ /g, '-');
            let category = await this.categoryRepository.findOne({ slug: categorySlug });
            if (!category) {
                await this.categoryRepository.save(this.categoryRepository.create({ slug: categorySlug, name: categoryName, coverImage }));
            }

            return { ok: true, message: "Restaurant Category created successfully" }
        } catch (error) {
            return { ok: false, message: "Could not create restaurant category" }
        }
    }
}