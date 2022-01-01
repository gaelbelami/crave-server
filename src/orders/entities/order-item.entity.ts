import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Dish, DishChoice, DishOption } from "src/dishes/entities/dish.entity";
import { CoreEntity } from "src/shared/entities/core.entity";
import { Column, Entity, ManyToOne } from "typeorm";


@InputType('OrderItemOptionInputType', { isAbstract: true })
@ObjectType()
export class OrderItemOption {
    @Field(type => String)
    name: string;

    @Field(type => String, { nullable: true })
    choice?: string;
}


@InputType('OrderItemInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class OrderItem extends CoreEntity {

    @Field(type => Dish)
    @ManyToOne(type => Dish, { nullable: true, onDelete: "CASCADE" })
    dish: Dish;

    @Field(type => [OrderItemOption], { nullable: true })
    @Column({ type: "json", nullable: true })
    options?: OrderItemOption[]
}