"use strict"

import amqp, {Connection} from 'amqplib/callback_api';


// class EmailConsumer{
//     constructor(){
//         this.connection = await  amqp.connect('amqp://localhost?heartbeat=5s')
//     }

//     async createChannel(msg) {
//         try {
//             const channel = await this.connection.createChannel()
//             const queue = 'hello'
//             channel.assertExchange(queue,'fanout',{durable: true})
//             channel.sendToQueue(queue, Buffer.from(msg))
//             setTimeout(()=>{
//                 this.connection.close()
//             }, 500)
//         } catch (error) {
            
//         }
//     }
// }

interface User {
    name: string,
    email: string
    link: string
}

async function VerifyEmailPublisher(msg:User) {
    const connect =  await amqp.connect('amqp://localhost');
    const channel = await connect.createChannel();

    await channel.assertExchange('email_service','fanout',{durable: true})

    channel.publish('email_service','verify_account', Buffer.from(JSON.stringify(msg)));
    await connect.close()
    // setTimeout(() => {
    //     connect.close();
    //     process.exit(0);
    //   }, 500);
}

export default VerifyEmailPublisher;
