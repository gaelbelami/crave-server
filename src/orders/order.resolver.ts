import { Inject } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";
import { AuthUser } from "src/auth/auth.user.decorator";
import { Role } from "src/auth/role.decorator";
import { PUB_SUB } from "src/shared/constants/common.constants";
import { User } from "src/users/entities/user.entity";
import { CreateOrderInput, CreateOrderOutput } from "./dtos/create-order.dto";
import { EditOrderInput, EditOrderOutput } from "./dtos/edit-order.dto";
import { GetOrderInput, GetOrderOutput } from "./dtos/get-order.dto";
import { GetOrdersInput, GetOrdersOutput } from "./dtos/get-orders.dto";
import { Order } from "./entities/order.entity";
import { OrderService } from "./orders.service";



@Resolver(of => Order)
export class OrderResolver {
    constructor(private readonly orderService: OrderService, @Inject(PUB_SUB) private readonly pubSub: PubSub) { }

    @Mutation(returns => CreateOrderOutput)
    @Role(['client'])
    async createOrder(@AuthUser() customer: User, @Args('createOrderInput') createOrderInput: CreateOrderInput): Promise<CreateOrderOutput> {
        return this.orderService.createOrder(customer, createOrderInput);
    }


    @Query(returns => GetOrdersOutput)
    @Role(['any'])
    async getOrders(@AuthUser() user: User, @Args("getOrdersInput") getOrdersInput: GetOrdersInput): Promise<GetOrdersOutput> {
        return this.orderService.getOrders(user, getOrdersInput);
    }


    @Query(returns => GetOrderOutput)
    @Role(['any'])
    async getOrder(@AuthUser() user: User, @Args("getOrderInput") getOrderInput: GetOrderInput): Promise<GetOrderOutput> {
        return this.orderService.getOrder(user, getOrderInput);
    }

    @Mutation(returns => EditOrderOutput)
    @Role(["any"])
    async editOrder(@AuthUser() user: User, @Args("editOrderInput") editOrderInput: EditOrderInput): Promise<EditOrderOutput> {
        return this.orderService.editOrder(user, editOrderInput);
    }
}