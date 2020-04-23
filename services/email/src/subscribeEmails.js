"use strict"
import { connect as _connect } from 'amqplib/callback_api';
import mail from './emailer';
import queues from './utils/queues';

const queues_array = [ 'verify_account', 'verify_device', 'unblock_device', 'forgot_password']

async function EmailConsumer() {
    try {
        const connect =  await _connect('amqp://localhost');
        const channel = await connect.createChannel();
    
        await channel.assertExchange('email_service','topic',{durable: true})
        queues(channel, queues_array, 'email_service')
        channel.prefetch(1);
        channel.consume(q.queue, async function(msg) {
            console.log(msg)
            if (msg.content) {
                const {sender, reciever, subject, body , type} = JSON.parse(msg.content)
                await mail(sender, reciever ,subject, body, type);
            }
        }, {noAck: true})
        
    } catch (error) {
        return process.exit(1);
    }
}
export default EmailConsumer;

