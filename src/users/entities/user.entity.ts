import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { CoreEntity } from 'src/shared/entities/core.entity';
import { BeforeInsert, Column, Entity } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { IsDate, IsEmail, IsEnum, IsNumber, IsString, Length } from 'class-validator';

enum UserRole {
  client = 'client',
  owner= 'owner',
  delivery= 'delivery',
}

registerEnumType(UserRole, { name: "UserRole"})

@InputType({isAbstract: true})
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Column()
  @Field(type => String)
  @IsString()
  @Length(3, 15)
  firstName: string;

  @Column()
  @Field(type => String)
  @IsString()
  @Length(3, 15)
  lastName: string;

  @Column({nullable: true})
  @Field(type => String, {nullable: true})
  @IsString()
  @Length(3, 15)
  username?: string;

  @Column({nullable: true})
  @Field(type => Number, {nullable: true})
  @IsNumber()
  phoneNumber?: number;

  @Column({nullable: true})
  @Field(type => String, {nullable: true})
  @IsString()
  address?: string;

  @Column({nullable: true})
  @Field(type => Date, {nullable: true})
  @IsDate()
  birthdate?: Date;

  @Column() 
  @Field(type => String)
  @IsEmail()
  @Length(3, 25)
  email: string;

  @Column()
  @Field(type => String)
  @IsString()
  @Length(8, 25)
  password: string;
 
  @Column({ type: 'enum', enum: UserRole})
  @Field(type => UserRole)
  @IsEnum(UserRole)
  role: UserRole;


  // Hashing the password
  @BeforeInsert()
  async hashPassword(): Promise<void> {
   try {
      this.password = await bcrypt.hash(this.password, 10)
   } catch (error) {
     console.log(error)
     throw new InternalServerErrorException()
   }
  }

  // Checking correct password on login
  async checkPassword(aPassword: string): Promise<boolean>{
    try {
      const ok = await bcrypt.compare(aPassword, this.password)
      return ok;
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException();
    }
  }
}
