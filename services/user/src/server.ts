
import dotenv from "dotenv";
import { GraphQLServer } from "graphql-yoga";
import db from "./config/db";
import context from "./context";
import errorHandlers from "./middleware/errorHandler";
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

const server = new GraphQLServer({ typeDefs, resolvers, context });

const options = {
  port: 8000,
  endpoint: "/users",
  subscriptions: "/subscriptions",
  playground: "/playground",
};

server.start(options, ({ port }) =>
  console.log(
    `Server started, listening on port ${port} for incoming requests.`,
  ),
);
