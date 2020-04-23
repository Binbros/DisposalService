import createTransport from './nodemailer';
import { generate } from './mailgen';
import message from './messages';

async function emailer(sender , reciever , body, type) {
    try {
       const info = await createTransport().sendMail({
            from: sender || '"Fred Foo 👻" <foo@example.com>', // sender address
            to: reciever, // list of receivers
            subject: template.subject, // Subject line
            // text: "Hello world?", // plain text body
            html: generate(message(type, body))
        })
        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        return process.exit(1)
    }
}

export default emailer;