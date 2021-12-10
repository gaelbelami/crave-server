import { InputType, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/shared/dtos/output.dto";
import { UserVerification } from "../entities/user.verification.entity";



@InputType()
export class VerifyEmailInput extends PickType(UserVerification, ["code"]){}

@ObjectType()
export class VerifyEmailOutput extends CoreOutput{}