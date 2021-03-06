import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/shared/dtos/output.dto";
import { User } from "../entities/user.entity";


@InputType()
export class CreateUserAccountInput extends PickType(User, ["firstName", "lastName", "email", "password", "role"]) { }

@ObjectType()
export class CreateUserAccountOutput extends CoreOutput { }