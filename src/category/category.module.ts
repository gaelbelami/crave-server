import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { CategoryResolver } from './category.resolver';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([Category, Restaurant])],
    providers: [CategoryResolver, CategoryService],
    exports: [CategoryService]
})
export class CategoryModule { }


