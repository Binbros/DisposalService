import http from 'http';
import express from 'express';
import { ApolloServer} from 'apollo-server-express';
import depthLimit from 'graphql-depth-limit';
import parser from 'body-parser';
import redis from 'redis';
import dotenv from 'dotenv';
import morgan from 'morgan';
import schema from './schema';
import middleware from './middleware';
import routes from './route';
import logger from './utils/logger';
import { applyMiddleware, applyRoutes } from './utils';
import errorHandlers from './middleware/errorHandler';
dotenv.config()
process.on('uncaughtException', (e) => {
    logger.error('uncaught exception', e)
    process.exit(1)
})
process.on('unhandledRejection', (e) => {
    logger.error('Unhandled Promise rejection', e)
    process.exit(1)
})

const router = express()
router.use(morgan('combined', {
    stream: {
        write: (message: any) => {
            logger.info(message);
        },
    }
}))
const graphqlServer = new ApolloServer({
    schema,
    validationRules: [depthLimit(7)]
})

applyMiddleware(middleware, router)
applyRoutes(routes, router)
applyMiddleware(errorHandlers, router)
graphqlServer.applyMiddleware({ app: router, path: '/disposal' })


const redisClient = redis.createClient({ host: process.env.REDIS_PORT, port: Number(process.env.REDIS_PORT), retry_strategy: () => 1000 });
// process.env.REDIS_URL is the redis url config variable name on heroku. 
// if local use redis.createClient()
redisClient.on('connect', () => {
    logger.warn('Redis client connected')
});
redisClient.on('error', (error: string) => {
    logger.error(error)
});

const { PORT = 3000 } = process.env

const server = http.createServer(router)

server.listen(PORT, () => {
    // tslint:disable-next-line: no-console
    logger.warn(`Disposal service is running on port ${PORT}`)
})
