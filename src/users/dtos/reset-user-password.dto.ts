import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/shared/dtos/output.dto";
import { User } from "../entities/user.entity";



@InputType()
export class ResetPasswordUserInput extends PickType(User, ["password"]) {
    @Field(type => String)
    code: string;

    @Field(type => String)
    confirmPassword: string;

}


@ObjectType()
export class ResetPasswordUserOutput extends CoreOutput { }