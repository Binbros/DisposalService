import http from 'http';
import express from 'express';
import { applyMiddleware, applyRoutes } from "./utils";
import middleware from "./middleware";
import routes from './src/route';
import errorHandlers from './middleware/errorHandler'

process.on('uncaughtException', e => {
    console.log(e)
    process.exit(1)
})
process.on('unhandledRejection', e => {
    console.log(e)
    process.exit(1)
})
const service = express()
applyMiddleware(middleware, service)
applyRoutes(routes, service)
applyMiddleware(errorHandlers, service)

const { PORT = 3000 } = process.env

const server = http.createServer(service)

server.listen(PORT, () => {
    // tslint:disable-next-line: no-console
    console.log(`Disposal service is running on port ${PORT}`)
})
