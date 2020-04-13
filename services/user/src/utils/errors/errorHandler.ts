import { NextFunction, Response } from "express";
import logger from "../logger";
import { HTTP400Error } from "./http400Error";
import { HTTP404Error } from "./http404Error";
import { HTTPClientError } from "./httpClientError";

export const notFoundError = (message: string | object) => {
    throw new HTTP404Error(message);
};
export const badRequestError = (message: string | object) => {
    throw new HTTP400Error(message);
};
export const clientError = (err: Error, res: Response, next: NextFunction) => {
    if (err instanceof HTTPClientError) {
        logger.error(err);
        res.status(err.statusCode).send(err.message);
    } else {
        next(err);
    }
};
export const serverError = (err: Error, res: Response, next: NextFunction) => {
    logger.error(err);
    if (process.env.NODE_ENV === "production") {
        res.status(500).send("Internal Server Error");
    } else {
        res.status(500).send(err.stack);
    }
};
