"use strict"
const amqp=  require ('amqplib');
const mail = require('./emailer');
const queues  = require('./utils/queues');

const queues_array = [ 'verify_account', 'verify_device', 'unblock_device', 'forgot_password']

module.exports = async function EmailConsumer() {
    // while (true) {
        try {
            let conn =  await amqp.connect('amqp://rabbitmq?connection_attempts=5&retry_delay=5');

            conn.on("close", function() {
                console.error("[AMQP] reconnecting");
                return setTimeout(EmailConsumer, 1000);
            })
     
            let channel = await conn.createChannel();
         
            await channel.assertExchange('email_service','direct',{durable: true})
            channel.prefetch(1);
            queues(channel, queues_array, 'email_service')
    
        } catch (error) {
           console.log(error)
        }  
    // }
}


