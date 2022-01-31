import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Restaurant } from "src/restaurants/entities/restaurant.entity";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import { CreatePaymentInput, CreatePaymentOutput } from "./dtos/create-payment.dto";
import { GetPaymentOutput } from "./dtos/get-payment.dto";
import { Payment } from "./entities/payment.entity";



@Injectable()
export class PaymentService {
    constructor(
        @InjectRepository(Payment) private readonly paymentRepository: Repository<Payment>,
        @InjectRepository(Restaurant) private readonly restaurantRepository: Repository<Restaurant>,) { }

    async createPayment(owner: User, { transactionId, restaurantId }: CreatePaymentInput): Promise<CreatePaymentOutput> {
        try {
            const restaurant = await this.restaurantRepository.findOne(restaurantId);
            if (!restaurant) {
                return {
                    ok: false,
                    message: "Restaurant not found.",
                }
            }
            if (restaurant.ownerId !== owner.id) {
                return {
                    ok: false,
                    message: "You are not allowed to create a payment.",
                }
            }
            await this.paymentRepository.save(this.paymentRepository.create({
                transactionId,
                user: owner,
                restaurant,
            }))
            return {
                ok: true,
                message: "Payment bundle created successfully"
            }
        } catch (error) {
            return {
                ok: false,
                message: "Something went wrong"
            }



        }
    }

    async getPayments(user: User): Promise<GetPaymentOutput> {
        try {
            const payments = await this.paymentRepository.find({ user: user })
            if (!payments) {
                return {
                    ok: false,
                    message: "No payments to show"
                }
            }
            return {
                ok: true,
                payments,
            }
        } catch (error) {
            return {
                ok: false,
                message: "Could not load payments"
            }
        }
    }


}