import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsBoolean, IsOptional, IsString, Length } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";



@InputType({isAbstract: true})
@ObjectType()
@Entity()
export class Restaurant {

    @PrimaryGeneratedColumn()
    @Field(returns => Number)
    id: number;

    @Field( returns => String )
    @Column()
    @IsString()
    @Length(5)
    name: string;

    @Field( returns => Boolean, {defaultValue: true})
    @Column({default: true})
    @IsBoolean()
    @IsOptional()
    isVegan?: boolean;
    
    @Field( returns => String)
    @Column()
    @IsString()
    address: string;
    
    @Field( returns => String)
    @Column()
    @IsString()
    ownersName: string;

    @Field( returns => String)
    @Column()
    @IsString()
    categoryName: string;
    
}