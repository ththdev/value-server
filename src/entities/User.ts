import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Transaction } from './Transaction'

@ObjectType()
@Entity()
export class User extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Column({ unique: true })
    email: string;

    @Field()
    @Column()
    username: string;

    @Column()
    password: string;

    @Field()
    @Column({ default: "local" })
    provider: string;

    @Field(() => [Transaction])
    @OneToMany(() => Transaction, transaction => transaction.user, { nullable: true, cascade: true})
    transactions?: Transaction[]
}