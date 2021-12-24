import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { AuthUser } from "src/auth/auth.user.decorator";
import { Role } from "src/auth/role.decorator";
import { User } from "src/users/entities/user.entity";
import { DishService } from "./dishes.service";
import { CreateDishInput, CreateDishOutput } from "./dtos/create-dish.dto";
import { DeleteDishInput, DeleteDishOutput } from "./dtos/delete-dish.dto";
import { EditDishInput, EditDishOutput } from "./dtos/edit-dish.dto";
import { Dish } from "./entities/dish.entity";



@Resolver(of => Dish)
export class DishResolver {
    constructor(private readonly dishService: DishService) { }

    @Mutation(type => CreateDishOutput)
    @Role(["owner"])
    createDish(@AuthUser() owner: User, @Args('createDishInput') createDishInput: CreateDishInput): Promise<CreateDishOutput> {
        return this.dishService.createDish(owner, createDishInput);
    }


    @Mutation(type => EditDishOutput)
    @Role(["owner"])
    editDish(@AuthUser() owner: User, @Args('editDishInput') editDishInput: EditDishInput): Promise<EditDishOutput> {
        return this.dishService.editDish(owner, editDishInput);
    }


    @Mutation(type => DeleteDishOutput)
    @Role(["owner"])
    deleteDish(@AuthUser() owner: User, @Args('deleteDishInput') deleteDishInput: DeleteDishInput): Promise<DeleteDishOutput> {
        return this.dishService.deleteDish(owner, deleteDishInput);
    }
}
