import { NextFunction, Request, Response, Router } from "express";
import { GraphQLServer } from "graphql-yoga";
import * as auth from "./auth";
import logger from './logger';
import secret from "./secret";
import publishMail from "./publishEmail";

type Wrapper =  ((router: GraphQLServer) => void);
type Handler = (
    req: Request,
    res: Response,
    next: NextFunction,
) => Promise <void> | void;

export const applyMiddleware = (
    middleware: Wrapper[],
    router: GraphQLServer,
  ) => {
    for (const f of middleware) {
      f(router);
    }
  };

export default({
    auth,
    logger,
    secret,
    publishMail,
  });
