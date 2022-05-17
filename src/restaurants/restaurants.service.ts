import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryService } from 'src/category/category.service';
import { Category } from 'src/category/entities/category.entity';
import { User } from 'src/users/entities/user.entity';
import { ILike, Repository } from 'typeorm';
import { CreateRestaurantInput, CreateRestaurantOutput } from './dtos/create-restaurant.dto';
import { DeleteRestaurantInput, DeleteRestaurantOutput } from './dtos/delete-restaurant.dto';
import { EditRestaurantInput, EditRestaurantOutput } from './dtos/edit-restaurant.dto';
import { MyRestaurantInput, MyRestaurantOutput } from './dtos/my-restaurant.dto';
import { RestaurantInput, RestaurantOutput } from './dtos/restaurant.dto';
import { RestaurantsInput, RestaurantsOutput } from './dtos/restaurants.dto';
import { SearchRestaurantInput, SearchRestaurantOutput } from './dtos/search-restaurant.dto';
import { MyRestaurantsInput, MyRestaurantsOutput } from './dtos/my-restaurants.dto';
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
        restaurantId: newRestaurant.id,
        message: "Restaurant created successfully"
      }
    } catch (error) {
      return {
        ok: false,
        message: "Couldn't create restaurant. Please input the right category"
      }
    }

  }

  async myRestaurants( owner: User, {page}: MyRestaurantsInput): Promise<MyRestaurantsOutput>{
   try {
      
  //  const restaurants = await this.restaurantRepository.find({owner})
   const [ restaurants , totalResults] = await this.restaurantRepository.findAndCount({ 
    skip: (page - 1) * 9,
        take: 9,
        order: {
          isPromoted: 'DESC',
        },
      where: {owner} })

    return {
      ok: true,
      results: restaurants,
      totalResults,
      totalPages: Math.ceil(totalResults / 9),
    }
    
   } catch (error) {
     return {
       ok: false,
       message: "Could not find restaurants."
     }
   }
  }

  async myRestaurant( owner:User, {id}: MyRestaurantInput): Promise<MyRestaurantOutput> {
    try {
      const restaurant = await this.restaurantRepository.findOne({owner, id}, {relations: ["menu", "orders"]});
      return {
        restaurant,
        ok:true
      }
    } catch (error) {
      return {
        ok:false,
        message: "Could not find restaurant.",
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

  async getAllRestaurnants({ page }: RestaurantsInput): Promise<RestaurantsOutput> {
    try {
      const [restaurants, totalResults] = await this.restaurantRepository.findAndCount({
        skip: (page - 1) * 9,
        take: 9,
        order: {
          isPromoted: 'DESC',
        }
      });
      return {
        ok: true,
        results: restaurants,
        totalResults,
        totalPages: Math.ceil(totalResults / 9),
      }
    } catch (error) {
      return {
        ok: false,
        message: "Could not load restaurants"
      }
    }
  }


  async findRestaurantById({ restaurantId }: RestaurantInput): Promise<RestaurantOutput> {
    try {
      const restaurant = await this.restaurantRepository.findOne(restaurantId, { relations: ['menu'] });
      if (!restaurant) {
        return {
          ok: false,
          message: "Restaurant not found",
        }
      }

      return {
        ok: true,
        restaurant,
      }
    } catch (error) {
      return {
        ok: false,
        message: "Could not find restaurant"
      }
    }
  }


  async searchRestaurantByname({ query, page }: SearchRestaurantInput): Promise<SearchRestaurantOutput> {
    try {
      const [restaurants, totalResults] = await this.restaurantRepository.findAndCount({
        where: {
          name: ILike(`%${query}%`),
        },
        skip: (page - 1) * 9,
        take: 9,
      });

      return {
        ok: true,
        restaurants,
        totalResults,
        totalPages: Math.ceil(totalResults / 9),
      }
    } catch (error) {
      return {
        ok: false,
        message: "Could not search for restaurants"
      }
    }
  }

}
