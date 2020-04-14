
import dotenv from "dotenv";
import express from "express";
import { GraphQLServer } from "graphql-yoga";
import redis from "redis";
import db from "./config/db";
import context from "./context";
import errorHandlers from "./middleware/errorHandler";
import middleware from "./middleware/index";
import resolvers from "./resolver";
import typeDefs from "./typedefs";
import { applyMiddleware, applyRoutes } from "./utils";
import logger from "./utils/logger";

dotenv.config();
process.on("uncaughtException", (e) => {
  logger.error("uncaught exception", e);
  process.exit(1);
});
process.on("unhandledRejection", (e) => {
  logger.error("Unhandled Promise rejection", e);
  process.exit(1);
});

db();


const server = new GraphQLServer({
  context,
  resolvers,
  typeDefs });
applyMiddleware(middleware, server);
applyMiddleware(errorHandlers, server);

const options = {
  endpoint: "/users",
  playground: "/playground",
  port: 8000,
  subscriptions: "/subscriptions",

};

// tslint:disable-next-line: no-shadowed-variable
server.start(options, ({port}) =>
logger.info(`Server started, listening on port ${port} for incoming requests.`),
)
