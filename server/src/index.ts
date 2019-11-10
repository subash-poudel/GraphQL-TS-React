import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./graphql/resolvers/UserResolver";
import { createConnection } from "typeorm";
import "dotenv/config";
import { port } from "./config/app";

(async () => {
  const app = express();
  await createConnection();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver]
    }),
    context: ({ req, res }) => ({
      req,
      res
    })
  });

  apolloServer.applyMiddleware({ app });

  app.listen(port, () => {
    console.log(`App is running on the port ${port}`);
  });
})();
