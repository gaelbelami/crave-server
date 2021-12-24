import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Restaurant } from "src/restaurants/entities/restaurant.entity";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import { CreateDishInput, CreateDishOutput } from "./dtos/create-dish.dto";
import { DeleteDishInput, DeleteDishOutput } from "./dtos/delete-dish.dto";
import { EditDishInput, EditDishOutput } from "./dtos/edit-dish.dto";
import { Dish } from "./entities/dish.entity";


@Injectable()
export class DishService {
    constructor(
        @InjectRepository(Dish)
        private readonly dishRepository: Repository<Dish>,
        @InjectRepository(Restaurant)
        private readonly restaurantRepository: Repository<Restaurant>) { }

    async createDish(owner: User, createDishInput: CreateDishInput): Promise<CreateDishOutput> {
        try {
            // Check if the dish is already created by the restaurant
            // Find the restaurant
            // Check the owner and restaurant owner are the same
            // Create a dish && Add a dish to the restaurant



            const restaurant = await this.restaurantRepository.findOne(createDishInput.restaurantId);
            if (!restaurant) {
                return {
                    ok: false,
                    message: "Restaurant not found"
                }
            }
            if (owner.id !== restaurant.ownerId) {
                return {
                    ok: false,
                    message: "Can't create a dish on a restaurant you don't own"
                }
            }
            // const dish = await this.dishRepository.findOne(createDishInput.name);
            // console.log(dish)
            // if (createDishInput.restaurantId === dish.restaurantId) {
            //     return {
            //         ok: false,
            //         message: "A similar dish already exist in your menu"
            //     }
            // }

            await this.dishRepository.save(this.dishRepository.create({ ...createDishInput, restaurant }))
            return {
                ok: true,
                message: "Created dish successfully"
            }
        } catch (error) {
            return {
                ok: false,
                message: "Could not create dish"
            }
        }
    }


    async editDish(owner: User, editDishInput: EditDishInput): Promise<EditDishOutput> {
        try {
            const dish = await this.dishRepository.findOne(editDishInput.dishId, { relations: ['restaurant'] });
            if (!dish) {
                return {
                    ok: false,
                    message: "Dish not found"
                }
            }
            if (dish.restaurant.ownerId !== owner.id) {
                return {
                    ok: false,
                    message: "You can't edit a dish that you don't own"
                }
            }
            await this.dishRepository.save([
                {
                    id: editDishInput.dishId,
                    ...editDishInput,
                }
            ])
            return {
                ok: true,
                message: "Updated dish successfully"
            }
        } catch (error) {
            return {
                ok: false,
                message: 'Could not update dish informations'
            }
        }
    }

    async deleteDish(owner: User, { dishId }: DeleteDishInput): Promise<DeleteDishOutput> {
        try {
            const dish = await this.dishRepository.findOne(dishId, { relations: ['restaurant'] });
            if (!dish) {
                return {
                    ok: false,
                    message: "Dish not found"
                }
            }
            if (dish.restaurant.ownerId !== owner.id) {
                return {
                    ok: false,
                    message: "You can't delete a dish that you don't own"
                }
            }
            await this.dishRepository.delete(dishId);
            return {
                ok: true,
                message: "Deleted dish successfully"
            }
        } catch (error) {
            return {
                ok: false,
                message: "Could not delete dish"
            }
        }
    }
}