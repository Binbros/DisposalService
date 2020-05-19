import { Response, NextFunction } from 'express';
import { HTTPClientError } from './httpClientError';
import { HTTP404Error } from './http404Error';
import { HTTP400Error } from './http400Error';
import logger from '../logger';

export const notFoundError = () => {
    throw new HTTP404Error()
}
export const badRequestError = () => {
    throw new HTTP400Error()
}
export const clientError = (err: Error, res: Response, next: NextFunction) => {
    if (err instanceof HTTPClientError) {
        logger.error(err)
        res.status(err.statusCode).send(err.message);
    } else {
        next(err);
    }
}
export const serverError = (err: Error, res: Response, next: NextFunction) => {
    logger.error(err);
    if (process.env.NODE_ENV === 'production') {
        res.status(500).send('Internal Server Error')
    } else {
        res.status(500).send(err.stack)
    }
}