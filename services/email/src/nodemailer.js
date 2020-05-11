const nodemailer = require("nodemailer");
const {server} = require('./config/config');

async function createTransport(obj) {
    const userAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        sendmail: true,
        port: 587,
        secure: false,
        auth: {
            user: userAccount.user,
            pass: userAccount.pass
        }
    })
    return transporter.sendMail(obj);
}

module.exports = createTransport;