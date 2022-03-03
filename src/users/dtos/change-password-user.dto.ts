import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/shared/dtos/output.dto";
import { User } from "../entities/user.entity";


@InputType()
export class ChangePasswordUserInput extends PickType(User, ["password"]){
    @Field(type => String)
    oldPassword: string;

    @Field(type => String)
    confirmPassword: string;
}

@ObjectType()
export class ChangePasswordUserOutput extends CoreOutput {}