import http from 'http';
import express from 'express';
import { applyMiddleware } from "./utils";
import middleware from "./middleware";

const service = express()
applyMiddleware(middleware, service)

const {PORT = 3000} = process.env

const server = http.createServer(service)

server.listen(PORT, () => {
    // tslint:disable-next-line: no-console
    console.log(`Disposal service is running on port ${PORT}`)
})
