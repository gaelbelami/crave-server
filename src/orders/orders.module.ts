import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dish } from 'src/dishes/entities/dish.entity';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { PUB_SUB } from 'src/shared/constants/common.constants';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';
import { OrderResolver } from './order.resolver';
import { OrderService } from './orders.service';

@Module({
    imports: [TypeOrmModule.forFeature([Order, Restaurant, Dish, OrderItem])],
    providers: [OrderResolver, OrderService],

})
export class OrdersModule { }
