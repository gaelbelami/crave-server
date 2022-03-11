import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Restaurant } from "src/restaurants/entities/restaurant.entity";
import { CoreEntity } from "src/shared/entities/core.entity";
import { User } from "src/users/entities/user.entity";
import { Entity, ManyToOne, RelationId } from "typeorm";



@InputType('ChatInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Chat extends CoreEntity {
    @Field(type => User)
    @ManyToOne(type => User, {eager: true})
    user: User

    // @RelationId((chat: Chat) => chat.user)
    // userId: number

    @Field(type => Restaurant)
    @ManyToOne( type => Restaurant, {eager: true})
    restaurant: Restaurant

    // @RelationId((chat: Chat) => chat.restaurant)
    // restaurantId: number
}