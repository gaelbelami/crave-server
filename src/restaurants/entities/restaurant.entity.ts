import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsBoolean, IsOptional, IsString, Length } from "class-validator";
import { Dish } from "src/dishes/entities/dish.entity";
import { Order } from "src/orders/entities/order.entity";
import { CoreEntity } from "src/shared/entities/core.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { Category } from "../../category/entities/category.entity";



@InputType('RestaurantInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Restaurant extends CoreEntity {


    @Field(type => String)
    @Column({ unique: true })
    @IsString()
    @Length(5)
    name: string;

    @Field(type => String)
    @Column()
    @IsString()
    address: string;

    @Field(type => String)
    @Column()
    @IsString()
    coverImage: string;

    @Field(type => User)
    @ManyToOne(type => User, user => user.restaurants, { onDelete: "CASCADE" })
    @IsString()
    owner: User;


    @Field(type => Category, { nullable: true })
    @ManyToOne(type => Category, category => category.restaurants, { nullable: true, onDelete: 'SET NULL' })
    category: Category;


    @RelationId((restaurant: Restaurant) => restaurant.owner)
    ownerId: number;

    @Field(type => [Dish])
    @OneToMany(type => Dish, dish => dish.restaurant)
    menu: Dish[];


    @Field(type => [Order])
    @OneToMany(type => Order, order => order.restaurant)
    orders: Order[];

    @Field(type => Boolean)
    @Column({ default: false })
    isPromoted: boolean;

    @Field(type => Date, { nullable: true })
    @Column({ nullable: true })
    promotedUntil: Date;
}