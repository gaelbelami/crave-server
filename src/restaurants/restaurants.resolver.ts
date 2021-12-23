import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth.user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateRestaurantInput, CreateRestaurantOutput } from './dtos/create-restaurant.dto';
import { DeleteRestaurantInput, DeleteRestaurantOutput } from './dtos/delete-restaurant.dto';
import { EditRestaurantInput, EditRestaurantOutput } from './dtos/edit-restaurant.dto';
import { RestaurantInput, RestaurantOutput } from './dtos/restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantService } from './restaurants.service';

@Resolver(of => Restaurant)
export class RestaurantResolver {
  constructor(private readonly restaurantService: RestaurantService) { }

  @Mutation(returns => CreateRestaurantOutput)
  @Role(['owner'])
  async createRestaurant(
    @AuthUser() loggedInUser: User,
    @Args('createRestaurantInput') createRestaurantInput: CreateRestaurantInput
  ): Promise<CreateRestaurantOutput> {
    return this.restaurantService.createRestaurant(loggedInUser, createRestaurantInput)
  }


  @Mutation(returns => EditRestaurantOutput)
  @Role(["owner"])
  async editRestaurant(
    @AuthUser() owner: User,
    @Args('editRestaurantInput') editRestaurantInput: EditRestaurantInput
  ): Promise<EditRestaurantOutput> {
    return this.restaurantService.editRestaurant(owner, editRestaurantInput);
  }


  @Mutation(returns => DeleteRestaurantOutput)
  @Role(['owner'])
  deleteRestaurant(@AuthUser() owner: User, @Args('deleteRestaurantInput') deleteRestaurantInput: DeleteRestaurantInput): Promise<DeleteRestaurantOutput> {
    return this.restaurantService.deleteRestaurant(owner, deleteRestaurantInput);
  }

  @Query(returs => RestaurantOutput)
  getAllRestaurnants(@Args('restaurantInput') restaurantInput: RestaurantInput): Promise<RestaurantOutput> {
    return this.restaurantService.getAllRestaurnants(restaurantInput);
  }
}
