import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Restaurant } from "src/restaurants/entities/restaurant.entity";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import { CreateDishInput, CreateDishOutput } from "./dtos/create-dish.dto";
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
            // Check if the dish is already owned by the restaurant
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
            if (owner.id !== restaurant.id) {
                return {
                    ok: false,
                    message: "Can't create a dish on a restaurant you don't own"
                }
            }

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
}