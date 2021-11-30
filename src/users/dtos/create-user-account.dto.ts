import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { User } from "../entities/user.entity";


@InputType()
export class CreateUserAccountInput extends PickType(User, ["firstName", "lastName", "email", "password", "role"]){}

@ObjectType()
export class CreateUserAccountOutput {
    @Field(type => String, {nullable:true})
    message?: string;

    @Field(type => Boolean)
    ok: boolean;
}