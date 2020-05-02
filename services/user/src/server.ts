
import dotenv from "dotenv";
import { GraphQLServer } from "graphql-yoga";
import db from "./config/db";
import context from "./context";
import middleware from "./middleware/index";
import resolvers from "./resolver";
import typeDefs from "./typedefs";
import { applyMiddleware } from "./utils";
import logger from "./utils/logger";
import validation from "./validations";

dotenv.config();
process.on("uncaughtException", (e) => {
  logger.error("uncaught exception ", e);
  // process.exit(1);
});
process.on("unhandledRejection", (e) => {
  logger.error("Unhandled Promise rejection", e);
  // process.exit(1);
});

db();

const server = new GraphQLServer({
  context,
  resolvers,
  typeDefs,
  // middlewares: validation,
},
  );

applyMiddleware(middleware, server);

const options = {
  endpoint: "/users",
  playground: "/",
  port: 8000,
  subscriptions: "/subscriptions",
};

// tslint:disable-next-line: no-shadowed-variable
server.start(options, ({port}) =>
logger.warn(`Server started, listening on port ${port} for incoming requests.`),
);
