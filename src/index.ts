import 'reflect-metadata'
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { createConnection } from "typeorm";
import { buildSchema } from "type-graphql";

// Resolvers
import { UserResolver } from "./resolvers/userResolver";
import { TransactionResolver } from './resolvers/transactionResolver';

const main = async () => {
  await createConnection().then((connection) => {
    console.log("Connection :", connection.isConnected);
  });

  const app = express();

  const apollo = new ApolloServer({
    schema: await buildSchema({ resolvers: [UserResolver, TransactionResolver] }),
    context: ({ req, res }: any) => ({ req, res })
  });

  apollo.applyMiddleware({ app })

  app.listen(4000, () => {
    console.log(`Value Server is Running at http://localhost:4000/graphql`);
  });
};

main();
