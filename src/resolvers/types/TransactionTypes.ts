import { Field, InputType } from "type-graphql";

@InputType()
export class CreateTransactionInputType {
  @Field()
  title: string;

  @Field()
  amount: number;

  @Field()
  date: Date;
}

@InputType()
export class UpdateTransactionInputType {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  amount?: number;

  @Field({ nullable: true })
  date?: string;
}
