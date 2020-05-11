const sendgrid = require('@sendgrid/mail')
const createTransport = require ('./nodemailer');
const mailgen = require('./mailgen')
const message =require('./messages');

module.exports = async function emailer(sender , reciever ,subject, body, type) {
    const messageBody = await message(type, body)
    console.log(reciever, 'the message body', body, subject, type, sender)
    try {
        // const mailer = await createTransport()
    //    const info = await createTransport({
    //         from: 'nmereginivincent@yahoo.com', // sender address
    //         to: 'nmereginivincent@gmail.com', // list of receivers
    //         subject: "subject", // Subject line
    //         text: "Hello world?", // plain text body
    //         html: mailgen.generate(messageBody)
    //     })
        const msg = {
            to: reciever,
            from: sender,
            subject,
            html: mailgen.generate(messageBody),
        }
        sendgrid.setApiKey("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")
        const info = await sendgrid.send(msg)

        console.log("Message sent: %s", info);
        return info;
    } catch (error) {
      console.log(error)
    }
}

