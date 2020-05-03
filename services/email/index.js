const http = require('http')
const email = require('./src/subscribeEmails');

const server = http.createServer((req, res) => {email()})
server.listen(2020,() => {
    console.log('Email service is running on port 2020')
})
// const express = require('express')

// const server = express()

// app.listen(port, () => {
//     console.log(`Example app listening at http://localhost:${port}`))