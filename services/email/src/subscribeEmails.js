"use strict"
const amqp=  require ('amqplib/callback_api');
const config = require("./config/config");
const queues  = require('./utils/queues');

const queues_array = [ 'verify_account', 'verify_device', 'unblock_device', 'forgot_password']

module.exports = async function EmailConsumer() {
    // while (true) {
        try {
            const conn =  await amqp.connect(config.amqp);

            conn.on("close", function() {
                console.error("[AMQP] reconnecting");
                return setTimeout(EmailConsumer, 1000);
            })
     
            const channel = await conn.createChannel();
         
            await channel.assertExchange('email_service','direct',{durable: true})
            channel.prefetch(1);
            queues(channel, queues_array, 'email_service')
    
        } catch (error) {
           console.log(error)
        }  
    // }
}


