const nodemailer = require("nodemailer");

async function createTransport() {
    const userAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: userAccount.user,
            pass: userAccount.pass
        }
    })
}

module.exports = createTransport;