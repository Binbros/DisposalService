import http from 'http';
import express from 'express';
import { applyMiddleware, applyRoutes } from "./utils";
import middleware from "./middleware";
import routes from './src/route';


const service = express()
applyMiddleware(middleware, service)
applyRoutes(routes, service)

const {PORT = 3000} = process.env

const server = http.createServer(service)

server.listen(PORT, () => {
    // tslint:disable-next-line: no-console
    console.log(`Disposal service is running on port ${PORT}`)
})
