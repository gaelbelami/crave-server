import { InputType, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/shared/dtos/output.dto";
import { User } from "../entities/user.entity";



@InputType()
export class ForgotUserPasswordInput extends PickType(User, ["id", "email"]){}


@ObjectType()
export class ForgotUserPasswordOutput extends CoreOutput{}