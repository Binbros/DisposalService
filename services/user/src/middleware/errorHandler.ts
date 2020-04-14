import {NextFunction , Request , Response , Router} from "express";
import {GraphQLServer} from "graphql-yoga";
import * as ErrorHandler from "../utils/errors/errorHandler";

const handle404Error = (router: GraphQLServer) => {
    router.use((req: Request , res: Response, message: string |object) => {
        ErrorHandler.notFoundError(message);
    });
};
const handle400Error = (router: GraphQLServer) => {
    router.use((req: Request , res: Response, message: string |object) => {
        ErrorHandler.badRequestError(message);
    });
};

const handleClientErrors = (router: GraphQLServer) => {
    router.use((err: Error , req: Request , res: Response , next: NextFunction) => {
    ErrorHandler.clientError(err, res, next);
    });
};
const handleServerErrors = (router: GraphQLServer) => {
    router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        ErrorHandler.serverError(err, res, next);
    });
};

export default [handle404Error, handleClientErrors , handleServerErrors, handle400Error ];
