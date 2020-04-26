"use strict";
import amqp from "amqplib";

interface IUserMail {
    sender: string;
    reciever: string;
    body: object;
    type: string;
    subject: string;
}

async function publishMail(msg: IUserMail)  {
    const connection =  await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    await channel.assertExchange("email_service", "direct", {durable: true});
    channel.publish("email_service", msg.type, Buffer.from(JSON.stringify(msg)));
    setTimeout(() => {
        connection.close();
        process.exit(0);
      }, 500);
}

export default publishMail;
