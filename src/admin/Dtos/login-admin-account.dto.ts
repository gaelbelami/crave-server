import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/shared/dtos/output.dto";
import { Admin } from "../entities/admin.entity";



@InputType()
export class LoginAdminInput extends PickType(Admin, ["email", "password"]){}


@ObjectType()
export class LoginAdminOutput extends CoreOutput{
    @Field(type => String, {nullable: true})
    token?: string;
}