import http from 'http';
import express from 'express';

const service = express()

const {PORT = 3000} = process.env

const server = http.createServer(service)

server.listen(PORT, () => {
    // tslint:disable-next-line: no-console
    console.log(`Disposal service is running on port ${PORT}`)
})
