import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/shared/dtos/output.dto";
import { Chat } from "../entities/chat.entity";


@InputType()
export class CreateChatInput  {
    
    @Field(type => Number)
    friendId: number;
}


@ObjectType()
export class CreateChatOutput extends CoreOutput {
    @Field( type => Chat, {nullable: true})
    chat?: Chat
}