import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { DishResolver } from './dishes.resolver';
import { DishService } from './dishes.service';
import { Dish } from './entities/dish.entity';


@Global()
@Module({
    imports: [TypeOrmModule.forFeature([Dish, Restaurant])],
    providers: [DishResolver, DishService],
    exports: [DishService]
})
export class DishesModule { }
