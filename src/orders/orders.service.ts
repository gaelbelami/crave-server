import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PubSub } from "graphql-subscriptions";
import { Dish } from "src/dishes/entities/dish.entity";
import { Restaurant } from "src/restaurants/entities/restaurant.entity";
import { NEW_COOKED_ORDER, NEW_ORDER_UPDATE, NEW_PENDING_ORDER, PUB_SUB } from "src/shared/constants/common.constants";
import { User, UserRole } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import { CreateOrderInput, CreateOrderOutput } from "./dtos/create-order.dto";
import { EditOrderInput, EditOrderOutput } from "./dtos/edit-order.dto";
import { GetOrderInput, GetOrderOutput } from "./dtos/get-order.dto";
import { GetOrdersInput, GetOrdersOutput } from "./dtos/get-orders.dto";
import { TakeOrderInput, TakeOrderOutput } from "./dtos/take-order.dto";
import { OrderItem } from "./entities/order-item.entity";
import { Order, OrderStatus } from "./entities/order.entity";



@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(OrderItem)
        private readonly orderItemRepository: Repository<OrderItem>,
        @InjectRepository(Dish)
        private readonly dishRepository: Repository<Dish>,
        @InjectRepository(Restaurant)
        private readonly restaurantRepostory: Repository<Restaurant>,
        @Inject(PUB_SUB) private readonly pubSub: PubSub
    ) { }


    async createOrder(customer: User, { restaurantId, items }: CreateOrderInput): Promise<CreateOrderOutput> {
        try {

            // Find restaurant
            // Create order(customer!)
            // Calculate the total money of the items
            // Add some items on the order

            let orderFinalPrice = 0;

            const orderItems: OrderItem[] = [];

            const restaurant = await this.restaurantRepostory.findOne(restaurantId);

            if (!restaurant) {
                return { ok: false, message: "No restaurant found" }
            }

            // Tip: Returns don't work inside a forEach, 
            // So we use , for ... of .. loop

            for (const item of items) {

                const dish = await this.dishRepository.findOne(item.dishId);

                if (!dish) {
                    return { ok: false, message: "Dish not found" }
                }

                let dishFinalPrice = dish.price;



                for (const itemOption of item.options) {
                    // Comparing the item options that the user gave with the options inside the database
                    // And the reason for this is to calculate the money of these options

                    const dishOption = dish.options.find(dishOption => dishOption.name === itemOption.name);

                    // Checking for the extra(money) on every option

                    if (dishOption) {
                        if (dishOption.extra) {
                            dishFinalPrice = dishFinalPrice + dishOption.extra;
                        } else {
                            // if extra isn't found on the first layer(options),
                            // we have to dig a little deeper(dish option choices)
                            const dishOptionChoice = dishOption.choices.find(
                                optionChoice => optionChoice.name === itemOption.choice,
                            );
                            if (dishOptionChoice) {
                                if (dishOptionChoice.extra) {
                                    dishFinalPrice = dishFinalPrice + dishOption.extra;
                                }
                            }
                        }
                    }
                }
                orderFinalPrice = orderFinalPrice + dishFinalPrice;
                const orderItem = await this.orderItemRepository.save(this.orderItemRepository.create({
                    dish, options: item.options,
                }));

                orderItems.push(orderItem);
            };



            const order = await this.orderRepository.save(this.orderRepository.create({ customer, restaurant, total: orderFinalPrice, items: orderItems, }));
            // console.log(order);
            await this.pubSub.publish(NEW_PENDING_ORDER, { pendingOrders: { order, ownerId: restaurant.ownerId } })

            return {
                ok: true,
                orderId: order.id,
                message: "Your order was done successfully"
            }
        } catch (error) {
            return { ok: false, message: "Could not create order" }
        }
    }


    async getOrders(user: User, { status }: GetOrdersInput): Promise<GetOrdersOutput> {
        try {
            let orders: Order[];

            if (user.role === UserRole.client) {
                orders = await this.orderRepository.find({
                    where: {
                        customer: user,
                        // The status will be set by default
                        ...(status && { status }),
                    }
                })
            } else if (user.role === UserRole.delivery) {
                orders = await this.orderRepository.find({
                    where: {
                        driver: user,
                        ...(status && { status }),
                    }
                })
            } else if (user.role === UserRole.owner) {
                const restaurants = await this.restaurantRepostory.find({
                    where: {
                        owner: user,
                    },
                    relations: ["orders"],
                });
                // Tip: "flat" method will just return on level of arrays
                orders = restaurants.map(restaurant => restaurant.orders).flat(1);
                if (status) {
                    orders = orders.filter(order => order.status === status)
                }
            }
            return { ok: true, orders }
        } catch (error) {
            return {
                ok: false,
                message: "Could not get orders",
            }
        }
    }


    canSeeOrder(user: User, order: Order): boolean {
        let canSee = true;
        if (user.role === UserRole.client && order.customerId !== user.id) {
            canSee = false;
        }
        if (user.role === UserRole.delivery && order.driverId !== user.id) {
            canSee = false;
        }
        if (user.role === UserRole.owner && order.restaurant.ownerId !== user.id) {
            canSee = false;
        }
        return canSee;
    }

    async getOrder(user: User, { id: orderId }: GetOrderInput): Promise<GetOrderOutput> {
        try {
            const order = await this.orderRepository.findOne(orderId, { relations: ["restaurant"] });
            if (!order) {
                return {
                    ok: false,
                    message: "Order not found"
                }
            }

            if (!this.canSeeOrder(user, order)) {
                return { ok: false, message: "You can't see orders that you didn't place" }
            }

            return { ok: true, order }

        } catch (error) {
            return {
                ok: false,
                message: "Could not load order",
            }
        }
    }


    async editOrder(user: User, { id: orderId, status }: EditOrderInput): Promise<EditOrderOutput> {
        try {
            const order = await this.orderRepository.findOne(orderId);
            if (!order) {
                return {
                    ok: false,
                    message: "Order not find"
                }
            }
            if (!this.canSeeOrder(user, order)) {
                return {
                    ok: false,
                    message: "You can't see orders that you didn't place"
                }
            }

            let canEdit = true;

            if (user.role === UserRole.client) {
                if (status !== OrderStatus.Cancelled) {
                    canEdit = false;
                }
            }

            if (user.role === UserRole.owner) {
                if (status !== OrderStatus.Cooking && status !== OrderStatus.Cooked) {
                    canEdit = false;
                }
            }
            if (user.role === UserRole.delivery) {
                if (status !== OrderStatus.PickedUp && status !== OrderStatus.Delivered) {
                    canEdit = false;
                }
            }
            if (!canEdit) {
                return { ok: false, message: "You can't update orders that you didn't place" }
            }
            await this.orderRepository.save({
                id: orderId,
                status,
            })
            const newOrder = { ...order, status }
            if (user.role === UserRole.owner) {
                // "NEW_COOKED_ORDER event" will go to the driver
                if (status === OrderStatus.Cooked) {
                    await this.pubSub.publish(NEW_COOKED_ORDER, { cookedOrders: newOrder })
                }
            }
            // "NEW_ORDER_UPDATE event" will go to the everybody
            await this.pubSub.publish(NEW_ORDER_UPDATE, { orderUpdates: newOrder })

            return {
                ok: true,
                message: `The order is ${status}`
            }
        } catch (error) {
            return {
                ok: false,
                message: "Could not edit order"
            }
        }
    }

    async takeOrder(driver: User, { id: orderId }: TakeOrderInput): Promise<TakeOrderOutput> {
        try {
            const order = await this.orderRepository.findOne(orderId);
            if (!order) {
                return {
                    ok: false,
                    message: 'Order not found'
                }
            }
            if (order.driver) {
                return {
                    ok: false,
                    message: "This order already has a driver",
                }
            }
            await this.orderRepository.save({
                id: orderId,
                driver,
            })
            await this.pubSub.publish(NEW_ORDER_UPDATE, {
                orderUpdates: { ...order, driver },
            })
            return {
                ok: true,

            }
        } catch (error) {
            return {
                ok: false,
                message: "Could not update the order."
            }
        }
    }
}