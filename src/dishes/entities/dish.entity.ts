import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsNumber, IsString, Length } from "class-validator";
import { Restaurant } from "src/restaurants/entities/restaurant.entity";
import { CoreEntity } from "src/shared/entities/core.entity";
import { Column, Entity, ManyToOne, RelationId } from "typeorm";



@InputType('DishInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Dish extends CoreEntity {
    @Field(type => String)
    @Column()
    @IsString()
    @Length(15)
    name: string;

    @Field(type => Number)
    @Column()
    @IsNumber()
    price: number;


    @Field(type => String)
    @Column()
    @IsString()
    photo: string;


    @Field(type => String)
    @Column()
    @IsString()
    @Length(5, 140)
    description: string;


    @Field(type => Restaurant, { nullable: true })
    @ManyToOne(type => Restaurant, restaurant => restaurant.menu, { onDelete: 'CASCADE' })
    restaurant: Restaurant;


    @RelationId((dish: Dish) => dish.restaurant)
    restaurantId: number;
}