import { InputType, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/shared/dtos/output.dto";
import { Order } from "../entities/order.entity";


@InputType()
export class TakeOrderInput extends PickType(Order, ["id"]) { }


@ObjectType()
export class TakeOrderOutput extends CoreOutput { }