import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { CoreOutput } from "src/shared/dtos/output.dto";
import { PaginationInput, PaginationOutput } from "src/shared/dtos/pagination.dto";
import { Order, OrderStatus } from "../entities/order.entity";



@InputType()
export class GetOrdersInput extends PaginationInput {
    @Field(type => OrderStatus, { nullable: true })
    status?: OrderStatus;
}



@ObjectType()
export class GetOrdersOutput extends PaginationOutput {
    @Field(type => [Order], { nullable: true })
    orders?: Order[];
}