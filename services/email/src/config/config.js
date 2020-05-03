const dotenv = require('dotenv');
dotenv.config()
module.exports = {
    amqp: process.env.AMQP,
    server: {
        port: process.env.PORT || 12345,
        host: process.env.HOST || "127.0.0.1"
    }
}