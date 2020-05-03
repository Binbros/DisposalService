const nodemailer = require("nodemailer");
const {server} = require('./config/config');

async function createTransport() {
    // const userAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
        host: server.host,
        port: server.port,
        // host: "smtp.ethereal.email",
        // port: 587,
        // secure: false,
        disableFileAccess: true,
        disableUrlAccess: true
        // auth: {
        //     user: userAccount.user,
        //     pass: userAccount.pass
        // }
    },{
        // Default options for the message. Used if specific values are not set
        from: 'sender@example.com'
    })
}

module.exports = createTransport;