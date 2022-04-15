import { Inject } from "@nestjs/common";
import { Args, Mutation, Query, Resolver, Subscription } from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";
import { AuthUser } from "src/auth/auth.user.decorator";
import { Role } from "src/auth/role.decorator";
import { NEW_COOKED_ORDER, NEW_ORDER_UPDATE, NEW_PENDING_ORDER, PUB_SUB } from "src/shared/constants/common.constants";
import { User } from "src/users/entities/user.entity";
import { CreateOrderInput, CreateOrderOutput } from "./dtos/create-order.dto";
import { EditOrderInput, EditOrderOutput } from "./dtos/edit-order.dto";
import { GetOrderInput, GetOrderOutput } from "./dtos/get-order.dto";
import { GetOrdersInput, GetOrdersOutput } from "./dtos/get-orders.dto";
import { OrderUpdatesInput } from "./dtos/order-updates.dto";
import { TakeOrderInput, TakeOrderOutput } from "./dtos/take-order.dto";
import { Order } from "./entities/order.entity";
import { OrderService } from "./orders.service";

@Resolver(of => Order)
export class OrderResolver {
    constructor(private readonly orderService: OrderService, @Inject(PUB_SUB) private readonly pubSub: PubSub) {

    }

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


    @Subscription(returns => Order, {
        filter: ({ pendingOrders: { ownerId } }, _, { user }) => {
            
            return ownerId === user.id;
        },
        resolve: ({ pendingOrders: { order } }) => order,
    })
    @Role(["owner"])
    pendingOrders() {
        return this.pubSub.asyncIterator(NEW_PENDING_ORDER)
    }


    @Subscription(returns => Order,)
    @Role(["delivery"])
    cookedOrders() {
        return this.pubSub.asyncIterator(NEW_COOKED_ORDER);
    }

    @Subscription(returns => Order, {
        filter: (
            { orderUpdates: order }: { orderUpdates: Order },
            { orderUpdatesInput }: { orderUpdatesInput: { id } },
            { user }: { user: User }
        ) => {
            // Checking that the people involved in this order are the ones getting it
            if (order.customerId !== user.id && order.driverId && order.restaurant.ownerId !== user.id) {
                return false;
            }
            return order.id === orderUpdatesInput.id;
        }
    })
    @Role(['any'])
    orderUpdates(@Args('orderUpdatesInput') orderUpdatesInput: OrderUpdatesInput) {
        return this.pubSub.asyncIterator(NEW_ORDER_UPDATE);
    }


    @Mutation(returns => TakeOrderOutput)
    @Role(["delivery"])
    takeOrder(@AuthUser() driver: User, @Args('takeOrderInput') takeOrderInput: TakeOrderInput): Promise<TakeOrderOutput> {
        return this.orderService.takeOrder(driver, takeOrderInput);
    }

    /* 
    A simple example that explains how the subscription works with NestJS
    */

    // @Mutation(returns => Boolean)
    // async potatoReady(@Args('potatoId') potatoId: number) {
    //     await this.pubSub.publish('hotPotatos', {
    //         readyPotato: potatoId,
    //     });
    //     return true;
    // }


    // @Subscription(returns => String, {
    //     // filter: (payload, variables, context) => {
    //     filter: ({ readyPotato }, { potatoId }, context) => {

    //         return readyPotato === potatoId;
    //     }
    // })
    // @Role(['any'])
    // async readyPotato(@Args('potatoId') potatoId: number) {
    //     return this.pubSub.asyncIterator('hotPotatos')
    // }

}