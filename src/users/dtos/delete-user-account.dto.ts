import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { CoreOutput } from "src/shared/dtos/output.dto";
import { User } from "../entities/user.entity";



@InputType()
export class DeleteUserAccountInput {
    @Field( type => Number)
    userId: number;
}


@ObjectType()
export class DeleteUserAccountOutput extends CoreOutput {
    @Field( type => User)
    user?: User;
}