import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { v4 as uuidv4 } from 'uuid'
import { CoreEntity } from "src/shared/entities/core.entity";
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { User } from "../../users/entities/user.entity";



@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class UserResetPassword extends CoreEntity {
    @Column()
    @Field(type => String)
    code: string;

    @OneToOne(type => User, { onDelete: "CASCADE" })
    @JoinColumn()
    user: User;


    @BeforeInsert()
    createVerificationCode(): void {
        this.code = uuidv4();
    }
}