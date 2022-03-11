

import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Restaurant } from "src/restaurants/entities/restaurant.entity";
import { CoreEntity } from "src/shared/entities/core.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, RelationId } from "typeorm";
import { Chat } from "./chat.entity";



@InputType('MessageInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Message extends CoreEntity {

    @Field(type => String)
    @Column()
    content: string;    

    @Field(type => Boolean, {defaultValue: false})
    @Column({default: false})
    see: boolean;

    @Field(type => User )
    @ManyToOne(type => User, user => user.messages)
    sender: User

    @Field(type => Chat)
    @ManyToOne( type => Chat)
    chat: Chat


    @Field(type => Number)
    @RelationId((message: Message) => message.chat)
    chatId: number;
} 