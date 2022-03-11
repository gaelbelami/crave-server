import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { PaginationInput, PaginationOutput } from "src/shared/dtos/pagination.dto";
import { User } from "src/users/entities/user.entity";
import { Chat } from "../entities/chat.entity";
import { Message } from "../entities/message.entity";



@InputType()
export class MyChatsInput extends PaginationInput {}


@ObjectType()
export class MyChatsOutput extends PaginationOutput {
    @Field(type => [Chat], { nullable: true })
    results?: Chat[]
}