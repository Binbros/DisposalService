import { NextFunction, Request, Response, Router } from "express";
import { GraphQLServer } from "graphql-yoga";

type Wrapper =  ((router: GraphQLServer) => void);
type Handler = (
    req: Request,
    res: Response,
    next: NextFunction,
) => Promise <void> | void;

interface IRoute {
    path: string;
    method: string;
    handler: Handler | Handler[];
}

export const applyMiddleware = (
    middleware: Wrapper[],
    router: GraphQLServer,
  ) => {
    for (const f of middleware) {
      f(router);
    }
  };

export const  applyRoutes = (routes: IRoute[], router: Router) => {
    for (const route of routes) {
        const {method , path , handler} = route;
        (router as any)[method](path, handler);
    }
};
