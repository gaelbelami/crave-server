import { InputType, ObjectType, OmitType, PartialType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/shared/dtos/output.dto";
import { User } from "../entities/user.entity";



@InputType()
export class EditUserProfileInput extends PartialType(PickType(User, ["firstName", "lastName", "email", "password", "username", "phoneNumber", "address", "birthdate", "avatar"])){}


@ObjectType()
export class EditUserProfileOutput extends CoreOutput{}