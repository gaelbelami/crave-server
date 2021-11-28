import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";



@ObjectType()
@Entity()
export class Restaurant {

    @PrimaryGeneratedColumn()
    @Field(returns => Number)
    id: number;

    @Field( returns => String )
    @Column()
    name: string;

    @Column()
    @Field( returns => Boolean, {nullable: true})
    isVegan?: boolean;
    
    @Column()
    @Field( returns => String)
    address: string;
    
    @Column()
    @Field( returns => String)
    ownersName: string;

    @Column()
    @Field( returns => String)
    categoryName: string;
    
}