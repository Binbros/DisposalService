const nodemailer = require("nodemailer");

async function createTransport() {
    // const userAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: 'gwen.kuvalis70@ethereal.email',
            pass: '2D6krWav1hzqwQU8yP'
        }
    })
}

module.exports = createTransport;