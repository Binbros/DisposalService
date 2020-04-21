"use strict"
const amqp = require('amqplib/callback_api');
const mail = require('./emailer');

async function EmailConsumer() {
    try {
        const connect =  await amqp.connect('amqp://localhost');
        const channel = await connect.createChannel();
    
        await channel.assertExchange('email_service','topic',{durable: true})
        const q = await channel.assertQueue('', {exclusive:true})
    
        channel.bindQueue(q.queue, 'email_service', 'email.#')
        channel.prefetch(1);
    
        channel.consume(q.queue, async function(msg) {
            console.log(msg)
            if (msg.content) {
                const {sender , reciever , subject , body } = JSON.parse(msg.content)
                await mail(sender , reciever, subject ,body);
            }
        }, {noAck: true})
        
    } catch (error) {
        return process.exit(1);
    }
}

module.exports = EmailConsumer;