"use strict"

import amqp, {Connection} from 'amqplib/callback_api';

interface User {
    name: string,
    email: string
    link: string
}
class VerifyEmailPublisher{
    connection: () => Promise<void>;
    constructor(){
        this.connection = async ()=> await amqp.connect('amqp://localhost')
    }

    async createChannel(msg:User) {
            const channel = await this.connection().createChannel()
            await channel.assertExchange('email_service','fanout',{durable: true})

            channel.publish('email_service','verify_account', Buffer.from(JSON.stringify(msg)));
            await this.connection().close()

            // setTimeout(()=>{
            //     this.connection.close()
            // }, 500)
    }
}



// async function VerifyEmailPublisher(msg:User) {
//     const connect =  await amqp.connect('amqp://localhost');
//     const channel = await connect.createChannel();

//     await channel.assertExchange('email_service','fanout',{durable: true})

//     channel.publish('email_service','verify_account', Buffer.from(JSON.stringify(msg)));
//     await connect.close()
//     // setTimeout(() => {
//     //     connect.close();
//     //     process.exit(0);
//     //   }, 500);
// }

export default new VerifyEmailPublisher();
