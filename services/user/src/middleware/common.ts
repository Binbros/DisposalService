import parser from "body-parser";
import compression from "compression";
import cookieparser from "cookie-parser";
import cors from "cors";
import csurf from "csurf";
import { NextFunction, Request, Response } from "express";
import {GraphQLServer} from "graphql-yoga"
import morgan from "morgan";
import logger from "../utils/logger";

export const handleCors = (router: GraphQLServer) =>
  router.use(cors({ credentials: true, origin: true }));

export const handleBodyRequestParsing = (router: GraphQLServer) => {
  router.use(parser.urlencoded({ extended: true }));
  router.use(parser.json());
};

export const handleCookieParsing = (router: GraphQLServer) => {
  router.use(cookieparser());
};
export const handleCsurf = (router: GraphQLServer) => {
  router.use(csurf({ cookie: true }));
};
export const handleCompression = (router: GraphQLServer) => {
  router.use(compression());
};

export const handleCsurfPrevention = (router: GraphQLServer) => {
  router.use("/", (req: Request, res: Response, next: NextFunction) => {
    const token = req.csrfToken();
    res.cookie("XSRF-TOKEN", token);
    next();
  });
};

export const handleLogStreaming = (router: GraphQLServer) => {
  router.use(morgan("combined", { stream: {
    write: (message: any) => {
      logger.info(message);
    },
  },
}))
};

