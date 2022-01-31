import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AuthUser } from "src/auth/auth.user.decorator";
import { Role } from "src/auth/role.decorator";
import { User } from "src/users/entities/user.entity";
import { CreatePaymentInput, CreatePaymentOutput } from "./dtos/create-payment.dto";
import { GetPaymentOutput } from "./dtos/get-payment.dto";
import { Payment } from "./entities/payment.entity";
import { PaymentService } from "./payment.service";



@Resolver(of => Payment)
export class PaymentResolver {
    constructor(private readonly paymentService: PaymentService) { }
    @Mutation(returns => CreatePaymentOutput)
    @Role(['owner'])
    createPayment(@AuthUser() owner: User, @Args('createPaymentInput') createPaymentInput: CreatePaymentInput): Promise<CreatePaymentOutput> {
        return this.paymentService.createPayment(owner, createPaymentInput);
    }

    @Query(returns => GetPaymentOutput)
    @Role(["owner"])
    getPayments(@AuthUser() owner: User): Promise<GetPaymentOutput> {
        return this.paymentService.getPayments(owner)
    }
}