import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryService } from 'src/category/category.service';
import { Category } from 'src/category/entities/category.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateRestaurantInput, CreateRestaurantOutput } from './dtos/create-restaurant.dto';
import { DeleteRestaurantInput, DeleteRestaurantOutput } from './dtos/delete-restaurant.dto';
import { EditRestaurantInput, EditRestaurantOutput } from './dtos/edit-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    private readonly categoryService: CategoryService,
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
      const newRestaurant = await this.restaurantRepository.create({ name, address, coverImage });

      let category = await this.categoryService.findByName(categoryName)
      if (!category) {
        return {
          ok: false,
          message: "Category not found"
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
        message: "Couldn't create restaurant. Please input the right category"
      }
    }

  }

  async editRestaurant(owner: User, editRestaurantInput: EditRestaurantInput): Promise<EditRestaurantOutput> {
    try {
      const restaurant = await this.restaurantRepository.findOne(editRestaurantInput.restaurantId, { loadRelationIds: true });
      if (!restaurant) {
        return {
          ok: false,
          message: "Restaurant not found"
        }
      }

      if (owner.id !== restaurant.ownerId) {
        return {
          ok: false,
          message: "You can't edit a restaurant that you don't own",
        }
      }
      let category: Category;
      if (editRestaurantInput.categoryName) {
        category = await this.categoryService.findByName(editRestaurantInput.categoryName);
      }

      await this.restaurantRepository.save([{
        id: editRestaurantInput.restaurantId,
        ...editRestaurantInput,
        ...(category && { category }),
      }])

      return {
        ok: true,
        message: "Edited restaurant successfully"
      }
    } catch (error) {

    }
  }

  async deleteRestaurant(owner: User, { restaurantId }: DeleteRestaurantInput): Promise<DeleteRestaurantOutput> {
    try {
      const restaurant = await this.restaurantRepository.findOne(restaurantId, { loadRelationIds: true });
      if (!restaurant) {
        return {
          ok: false,
          message: "Restaurant not found"
        }
      }

      if (owner.id !== restaurant.ownerId) {
        return {
          ok: false,
          message: "You can't delete a restaurant that you don't own",
        }
      }
      await this.restaurantRepository.delete(restaurantId);
      return {
        ok: true,
        message: "Restaurant deleted successfully"
      }
    } catch (error) {
      return {
        ok: false,
        message: "Could not delete the restaurant"
      }
    }
  }

  async countRestaurants(category: Category): Promise<number> {
    return this.restaurantRepository.count({ category })
  }
}
