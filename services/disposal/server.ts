import http from 'http';
import express from 'express';
import { applyMiddleware, applyRoutes } from './utils';
import middleware from './middleware';
import routes from './src/route';
import morgan from 'morgan';
import logger from './utils/logger';
import errorHandlers from './middleware/errorHandler'

process.on('uncaughtException', e => {
    console.log(e)
    process.exit(1)
})
process.on('unhandledRejection', e => {
    console.log(e)
    process.exit(1)
})
const router = express()
router.use(morgan('combined', {stream: {
    write: (message: any) => {
      logger.info(message);
    },
}}))
applyMiddleware(middleware, router)
applyRoutes(routes, router)
applyMiddleware(errorHandlers, router)

const { PORT = 3000 } = process.env

const server = http.createServer(router)

server.listen(PORT, () => {
    // tslint:disable-next-line: no-console
    logger.warn(`Disposal service is running on port ${PORT}`)
})