import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/shared/dtos/output.dto";
import { PaginationInput, PaginationOutput } from "src/shared/dtos/pagination.dto";
import { Message } from "../entities/message.entity";



@InputType()
export class MyMessagesInput extends PaginationInput{
    @Field(type => Number)
    chatId: number;
}


@ObjectType()
export class MyMessagesOutput extends PaginationOutput {
    @Field(type => [Message], { nullable: true })
    results?: Message[]
}