

import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/shared/dtos/output.dto";
import { Order } from "../entities/order.entity";




@InputType()
export class EditOrderInput extends PickType(Order, ['id', 'status']) { }


@ObjectType()
export class EditOrderOutput extends CoreOutput {
    @Field(type => Order, { nullable: true })
    order?: Order;
}