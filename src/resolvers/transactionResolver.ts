import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { Transaction } from "../entities/Transaction";
import { isAuth } from "./middlewares/isAuth";
import { Context } from "./types/Context";
import {
  CreateTransactionInputType,
  UpdateTransactionInputType,
} from "./types/TransactionTypes";

@Resolver()
export class TransactionResolver {
  @Query(() => [Transaction])
  @UseMiddleware(isAuth)
  async transactions(@Ctx() { payload }: Context) {
    const transactions = await Transaction.find({
      where: {
        user: payload?.id,
      },
    });

    return transactions;
  }

  @Mutation(() => Transaction)
  @UseMiddleware(isAuth)
  async createTransaction(
    @Arg("data") data: CreateTransactionInputType,
    @Ctx() { payload }: Context
  ) {
    const transaction = await Transaction.create({
      title: data.title,
      amount: data.amount,
      date: data.date,
      user: { id: payload!.id },
    }).save();

    const created = await Transaction.findOne(transaction.id, {
      relations: ["user"],
    });

    return created;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteTransaciton(
    @Ctx() { payload }: Context,
    @Arg("transactionId") transactionId: String
  ) {
    const transaction = await Transaction.findOne({
      where: {
        id: transactionId,
        user: payload?.id,
      },
    });
    if (!transaction) throw new Error("Cannot delete this transaction.");

    await transaction.remove();

    return true;
  }

  @Mutation(() => Transaction)
  @UseMiddleware(isAuth)
  async updateTransaction(
    @Arg("transactionId") transactionId: String,
    @Arg("data") data: UpdateTransactionInputType,
    @Ctx() { payload }: Context
  ) {
    const transaction = await Transaction.findOne({
      where: {
        id: transactionId,
        user: payload?.id,
      },
    });
    if (!transaction) throw new Error("Cannot update this transaction.");

    const newTransaction = { ...data };
    await Object.assign(transaction, newTransaction).save();

    return transaction;
  }
}
