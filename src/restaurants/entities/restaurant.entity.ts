import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsBoolean, IsOptional, IsString, Length } from "class-validator";
import { CoreEntity } from "src/shared/entities/core.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { Category } from "../../category/entities/category.entity";



@InputType('RestaurantInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Restaurant extends CoreEntity {


    @Field(type => String)
    @Column({ unique: true })
    @IsString()
    @Length(5)
    name: string;

    @Field(type => String)
    @Column()
    @IsString()
    address: string;

    @Field(type => String)
    @Column()
    @IsString()
    coverImage: string;

    @Field(type => User)
    @ManyToOne(type => User, user => user.restaurants, { onDelete: "CASCADE" })
    @IsString()
    owner: User;


    @Field(type => Category)
    @ManyToOne(type => Category, category => category.restaurants, { nullable: true, onDelete: 'SET NULL' })
    category: Category;


    @RelationId((restaurant: Restaurant) => restaurant.owner)
    ownerId: number;
}