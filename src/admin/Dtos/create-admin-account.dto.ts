import { InputType, ObjectType, PartialType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/shared/dtos/output.dto";
import { Admin } from "../entities/admin.entity";



@InputType()
export class CreateAdminAccountInput extends PickType(Admin, ["email", "password"]){}


@ObjectType()
export class CreateAdminAccountOutput extends CoreOutput{}