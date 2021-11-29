import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { UpdateRestaurantDto } from './dtos/update-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantService } from './restaurants.service';

@Resolver( of => Restaurant)
export class RestaurantResolver {
  constructor(private readonly restaurantService: RestaurantService){}
  @Query(returns => [Restaurant])
  restaurants(): Promise<Restaurant[]>{
    return this.restaurantService.getAllRestaurants()
  }

  @Mutation(returns => Boolean)
  async createRestaurant(
    @Args('createRestaurantDto') createRestaurantDto: CreateRestaurantDto
  ): Promise<boolean> { 
    try {
      await this.restaurantService.createRestaurant(createRestaurantDto)
      return true;
    } catch (error) {
      console.log(error)
      return false;
    }
  }

  @Mutation(returns => Boolean)
  async updateRestaurant( @Args('updateRestaurantDto') updateRestaurantDto: UpdateRestaurantDto): Promise<boolean>{
   try {
     await this.restaurantService.updateRestaurant(updateRestaurantDto)
     return true
    } catch (error) {
     console.log(error)
     return false
   }
  }
}
