const createTransport = require ('./nodemailer');
const mailgen = require('./mailgen')
const message =require('./messages');

module.exports = async function emailer(sender , reciever ,subject, body, type) {
    const messageBody = await message(type, body)
    try {
        const mailer = await createTransport()
       const info = await mailer.sendMail({
            from: 'noreply@binbro.com', // sender address
            to: reciever, // list of receivers
            subject: subject, // Subject line
            // text: "Hello world?", // plain text body
            html: mailgen.generate(messageBody)
        })

        console.log("Message sent: %s", info);
    } catch (error) {
      console.log(error)
    }
}

