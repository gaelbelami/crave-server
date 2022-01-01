import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Dish } from "src/dishes/entities/dish.entity";
import { Restaurant } from "src/restaurants/entities/restaurant.entity";
import { User, UserRole } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import { CreateOrderInput, CreateOrderOutput } from "./dtos/create-order.dto";
import { EditOrderInput, EditOrderOutput } from "./dtos/edit-order.dto";
import { GetOrderInput, GetOrderOutput } from "./dtos/get-order.dto";
import { GetOrdersInput, GetOrdersOutput } from "./dtos/get-orders.dto";
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
        private readonly restaurantRepostory: Repository<Restaurant>) { }


    async createOrder(customer, { restaurantId, items }: CreateOrderInput): Promise<CreateOrderOutput> {
        try {

            let orderFinalPrice = 0;

            let orderItems: OrderItem[];

            const restaurant = await this.restaurantRepostory.findOne(restaurantId);

            if (!restaurant) {
                return { ok: false, message: "No restaurant found" }
            }

            for (const item of items) {

                const dish = await this.dishRepository.findOne(item.dishId);

                if (!dish) {
                    return { ok: false, message: "Dish not found" }
                }

                let dishFinalPrice = dish.price;

                for (const itemOption of item.options) {
                    const dishOption = dish.options.find(dishOption => dishOption.name === itemOption.name);

                    if (dishOption) {
                        if (dishOption.extra) {
                            dishFinalPrice = dishFinalPrice + dishOption.extra;
                        } else {
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



            await this.orderRepository.save(this.orderRepository.create({ customer, restaurant, total: orderFinalPrice, items: orderItems, }));


            return {
                ok: true,
                message: ""
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
            const order = await this.orderRepository.findOne(orderId, { relations: ["restaurant"] });
            if (!order) {
                return {
                    ok: false,
                    message: "Could not find order"
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
                if (status !== OrderStatus.Pending) {
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
                return { ok: false, message: "You can't see orders that you didn't place" }
            }
            await this.orderRepository.save([{
                id: orderId,
                status,
            }])
            return {
                ok: true,
                message: `The order is ${status}`
            }
        } catch (error) {

        }
    }
}