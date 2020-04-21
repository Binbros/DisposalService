"use strict";

import * as Amqp from "amqp-ts";

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

interface IUser {
    name: string;
    email: string;
    link: string;
}

async function VerifyEmailPublisher(msg: IUser)  {
    const connection = new Amqp.Connection("amqp://localhost");
    // const connection =  await amqp.connect("amqp://localhost");
    // const channel = await connection.createChannel();
    const exchange = connection.declareExchange("email-service", "topic", {durable: true});

    // await channel.assertExchange("email_service", "fanout", {durable: true});
    await connection.completeConfiguration()
    const message = new Amqp.Message(msg);
    exchange.send(message, "email.verify.account");
    await connection.close();
    // channel.publish("email_service", "verify_account", Buffer.from(JSON.stringify(msg)));
    // await connection.close();
    // setTimeout(() => {
    //     connect.close();
    //     process.exit(0);
    //   }, 500);
}

export default VerifyEmailPublisher;
