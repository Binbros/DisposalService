const createTransport = require('../nodemailer.email');
const body = require('../mailGen');

async function verifyUserAccount(name, email, link) {
    try {
       const info = await createTransport().sendMail({
            from: '"Fred Foo 👻" <foo@example.com>', // sender address
            to: email, // list of receivers
            subject: "Verify account", // Subject line
            // text: "Hello world?", // plain text body
            html: body.verifyAccount(name, link)  
        })
        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        return process.exit(1)
    }
}

module.exports = verifyUserAccount;