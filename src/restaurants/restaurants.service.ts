import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/category/entities/category.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateRestaurantInput, CreateRestaurantOutput } from './dtos/create-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) { }

  async createRestaurant(owner: User, { name, address, coverImage, categoryName }: CreateRestaurantInput): Promise<CreateRestaurantOutput> {

    try {
      const restaurant = await this.restaurantRepository.findOne({ name });
      if (restaurant) {
        return {
          ok: false,
          message: "There is a restaurant with that name already"
        }
      }
      const newRestaurant = await this.restaurantRepository.create({ name, coverImage, address });
      const categoryNameTrimmed = categoryName.trim().toLocaleLowerCase();
      const categorySlug = categoryNameTrimmed.replace(/ /g, '-');
      let category = await this.categoryRepository.findOne({ slug: categorySlug });
      if (!category) {
        return {
          ok: false,
          message: "No category found"
        }
      }
      newRestaurant.owner = owner;
      newRestaurant.category = category;
      await this.restaurantRepository.save(newRestaurant);
      return {
        ok: true,
        message: "Restaurant created successfully"
      }
    } catch (error) {
      return {
        ok: false,
        message: "Couldn't create restaurant"
      }
    }

  }
}
