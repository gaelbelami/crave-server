import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/shared/dtos/output.dto";
import { OrderItemOption } from "../entities/order-item.entity";


@InputType()
class CreateOrderItemInput {
    @Field(type => Number)
    dishId: number;

    @Field(type => [OrderItemOption], { nullable: true })
    options?: OrderItemOption[];

    @Field(type => Number)
    quantity: number;
}

@InputType()
export class CreateOrderInput {
    @Field(type => Number)
    restaurantId: number;
    @Field(type => [CreateOrderItemInput])
    items: CreateOrderItemInput[];
}


@ObjectType()
export class CreateOrderOutput extends CoreOutput { 
    @Field(type => Number, {nullable: true})
    orderId?: number;
}