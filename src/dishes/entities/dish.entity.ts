import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsNumber, IsString, Length } from "class-validator";
import { Restaurant } from "src/restaurants/entities/restaurant.entity";
import { CoreEntity } from "src/shared/entities/core.entity";
import { Column, Entity, ManyToOne, RelationId } from "typeorm";


@InputType('DishChoiceInputType', { isAbstract: true })
@ObjectType()

export class DishChoice {
    @Field(type => String)
    name: string;

    @Field(type => Number, { nullable: true })
    extra?: number;
}

@InputType('DishOptionInputType', { isAbstract: true })
@ObjectType()
export class DishOption {
    @Field(type => String)
    name: string;

    @Field(type => [DishChoice], { nullable: true })
    choices?: DishChoice[];

    @Field(type => Number, { nullable: true })
    extra?: number;
}

@InputType('DishInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Dish extends CoreEntity {
    @Field(type => String)
    @Column()
    @IsString()
    @Length(5, 15)
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


    @Field(type => Restaurant)
    @ManyToOne(type => Restaurant, restaurant => restaurant.menu, { onDelete: 'CASCADE' })
    restaurant: Restaurant;


    @RelationId((dish: Dish) => dish.restaurant)
    restaurantId: number;

    @Field(type => [DishOption], { nullable: true })
    @Column({ type: "json", nullable: true })
    options?: DishOption[]
}