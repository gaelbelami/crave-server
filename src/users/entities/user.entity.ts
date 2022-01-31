import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreEntity } from 'src/shared/entities/core.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Payment } from 'src/payments/entities/payment.entity';

export enum UserRole {
  client = 'client',
  owner = 'owner',
  delivery = 'delivery',
}

registerEnumType(UserRole, { name: 'UserRole' });

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Column()
  @Field((type) => String)
  @IsString()
  @Length(3, 15)
  firstName: string;

  @Column()
  @Field((type) => String)
  @IsString()
  @Length(3, 15)
  lastName: string;

  @Column({ unique: true })
  @Field((type) => String)
  @IsString()
  @Length(3, 15)
  username?: string;

  @Column({ nullable: true })
  @Field((type) => Number, { nullable: true })
  @IsNumber()
  phoneNumber?: number;

  @Column({ nullable: true })
  @Field((type) => String, { nullable: true })
  @IsString()
  address?: string;

  @Column({ nullable: true })
  @Field((type) => Date, { nullable: true })
  @IsDate()
  birthdate?: Date;

  @Column({ unique: true })
  @Field((type) => String)
  @IsEmail()
  @Length(3, 45)
  email: string;

  @Column({ select: false })
  @Field((type) => String)
  @IsString()
  @Length(8, 25)
  password: string;

  @Column({ type: 'enum', enum: UserRole })
  @Field((type) => UserRole)
  @IsEnum(UserRole)
  role: UserRole;

  @Column({ default: false })
  @Field((type) => Boolean)
  @IsBoolean()
  verified: boolean;

  @Field(type => [Restaurant])
  @OneToMany(type => Restaurant, restaurant => restaurant.owner)
  restaurants: Restaurant[];

  @Field(type => [Order])
  @OneToMany(type => Order, order => order.customer)
  orders: Order[];


  @Field(type => [Order])
  @OneToMany(type => Order, order => order.driver)
  rides: Order[];

  @Field(type => [Payment])
  @OneToMany(type => Payment, payment => payment.user)
  payments: Payment[];

  //*********************************************HASH PASSWORD*********************************************//
  //**************************************************************************************************************//

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {

        this.password = await bcrypt.hash(this.password, 10);

      } catch (error) {

        throw new InternalServerErrorException();

      }
    }
  }

  //*********************************************CHECK PASSWORD*********************************************//
  //**************************************************************************************************************//

  async checkPassword(aPassword: string): Promise<boolean> {
    try {

      const ok = await bcrypt.compare(aPassword, this.password);

      return ok;

    } catch (error) {

      throw new InternalServerErrorException();

    }
  }


  //*********************************************AUTOGENERATE USERNAME*********************************************//
  //**************************************************************************************************************//

  @BeforeInsert()
  autogenerateUsername() {

    try {

      let result = '';

      const prefix = 'cvid_';

      const characters =
        'ABCD1EF4GuxydH2IJ5KLM6NOP3QR8STUVWXYZab8cdefgh9ijklmnopq7rstuvwXCFTNNJISxyz0123456789';

      const charactersLength = characters.length;

      for (let i = 0; i < 14; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }

      this.username = `${prefix}${result}`;

    } catch (error) {
      return "Could't generate username"
    }

  }
}
