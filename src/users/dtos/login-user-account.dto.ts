import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/shared/dtos/output.dto";
import { User } from "../entities/user.entity";

@InputType()
export class LoginUserInput extends PickType(User, ["email", "password",] ) {}

@ObjectType()
export class LoginUserOutput extends CoreOutput {
    @Field(type => String, {nullable: true})
    token?: string;
}