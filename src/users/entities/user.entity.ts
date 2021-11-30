import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { CoreEntity } from 'src/shared/entities/core.entity';
import { BeforeInsert, Column, Entity } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';

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
  firstName: string;

  @Column()
  @Field(type => String)
  lastName: string;

  @Column({nullable: true})
  @Field(type => String, {nullable: true})
  username?: string;

  @Column({nullable: true})
  @Field(type => Number, {nullable: true})
  phoneNumber?: number;

  @Column({nullable: true})
  @Field(type => String, {nullable: true})
  address?: string;

  @Column({nullable: true})
  @Field(type => Date, {nullable: true})
  birthdate?: Date;

  @Column() 
  @Field(type => String)
  email: string;

  @Column()
  @Field(type => String)
  password: string;
 
  @Column({ type: 'enum', enum: UserRole})
  @Field(type => UserRole)
  role: UserRole;


  @BeforeInsert()
  async hashPassword(): Promise<void> {
   try {
      this.password = await bcrypt.hash(this.password, 10)
   } catch (error) {
     console.log(error)
     throw new InternalServerErrorException()
   }
  }
}
