"use strict"
const amqp=  require ('amqplib');
const queues  = require('./utils/queues');

const queues_array = [ 'verify_account', 'verify_device', 'unblock_device', 'forgot_password']

const EmailConsumer = async function () {
    // while (true) {
        try {
            let conn =  await amqp.connect('amqp://guest:guest@rabbitmq:5672?connection_attempts=5&retry_delay=5');
            conn.on("error", function(err) {
                if (err.message !== "Connection closing") {
                  console.error("[AMQP] conn error", err.message);
                }
            })
            conn.on("close", function() {
                console.error("[AMQP] reconnecting");
                return setTimeout(EmailConsumer, 1000);
            })
     
            let channel = await conn.createChannel();
         
            await channel.assertExchange('email_service','direct',{durable: true})
            await queues(channel, queues_array, 'email_service')
    
        } catch (error) {
           console.log(error)
        }  
    // }
}
EmailConsumer()

