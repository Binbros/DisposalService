"use strict"
const amqp = require('amqplib/callback_api');
const mail = require('../sendemail/verify.user.email');

async function EmailConsumer() {
    try {
        const connect =  await amqp.connect('amqp://localhost');
        const channel = await connect.createChannel();
    
        await channel.assertExchange('email_service','fanout',{durable: true})
        const q = await channel.assertQueue('', {exclusive:true})
    
        channel.bindQueue(q.queue, 'email_service', 'verify_account')
    
        channel.consume(q.queue, async function(msg) {
            console.log(msg)
            if (msg.content) {
                const {name, email, link} = JSON.parse(msg.content)
                await mail(name, email, link);
            }
        }, {noAck: true})
        
    } catch (error) {
        return process.exit(1);
    }
}

module.exports = EmailConsumer;