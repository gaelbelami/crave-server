import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsEmail, IsEnum, IsString, Length } from 'class-validator';
import * as bcrypt from 'bcrypt'
import { CoreEntity } from 'src/shared/entities/core.entity';
import { BeforeInsert, Column, Entity } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';


export enum AdminRole {
  admin = 'admin',
  superAdmin = 'superAdmin',
  moderator = 'moderator',
}

registerEnumType(AdminRole, { name: "AdminRole" })

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Admin extends CoreEntity {
  @Column({ nullable: true })
  @Field({ nullable: true })
  @IsString()
  @Length(5, 15)
  firstName: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  @IsString()
  lastName: string;

  @Column()
  @Field()
  @IsEmail()
  email: string;

  @Column()
  @Field()
  @IsString()
  @Length(8, 25)
  password: string;

  @Column({ default: AdminRole.superAdmin })
  @Field({ defaultValue: AdminRole.superAdmin })
  @IsString()
  @IsEnum({ AdminRole })
  role: AdminRole;


  @BeforeInsert()
  async hashPassword(): Promise<void> {
    try {
      this.password = await bcrypt.hash(this.password, 10)
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }

  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      const ok = await bcrypt.compare(aPassword, this.password)
      return ok;
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException()
    }
  }
}
