const createTransport = require('./nodemailer');
const template = require('./template')

async function emailer(sender , reciever, subject, body) {
    try {
       const info = await createTransport().sendMail({
            from: sender || '"Fred Foo 👻" <foo@example.com>', // sender address
            to: reciever, // list of receivers
            subject, // Subject line
            // text: "Hello world?", // plain text body
            html: template(body) 
        })
        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        return process.exit(1)
    }
}

module.exports = emailer;