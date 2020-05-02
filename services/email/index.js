const http = require('http')
const email = require('./src/subscribeEmails');
// while (true) {
//     email()
// }
const server = http.createServer((req, res) => {
        email()  
})
server.listen(2020,() => {console.log('Email service is running on port 2020')})