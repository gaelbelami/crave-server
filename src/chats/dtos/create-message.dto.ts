import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/shared/dtos/output.dto";
import { Message } from "../entities/message.entity";


@InputType()
export class CreateMessageInput extends PickType(Message, ["chatId", "content", "see"]) {}


@ObjectType()
export class CreateMessageOutput extends CoreOutput {
    @Field(type => Message)
    message?: string;
} 