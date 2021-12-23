import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/category/entities/category.entity';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantResolver } from './restaurants.resolver';
import { RestaurantService } from './restaurants.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, Category])],
  providers: [RestaurantResolver, RestaurantService],
  exports: [RestaurantService]
})
export class RestaurantsModule { }
