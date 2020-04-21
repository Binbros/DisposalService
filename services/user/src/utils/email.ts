"use strict";

import * as Amqp from "amqp-ts";

interface IUserMail {
    name: string;
    email: string;
    token: string;
    type: string;
}

async function publishMail(msg: IUserMail)  {
    const connection = new Amqp.Connection("amqp://localhost");
    // const connection =  await amqp.connect("amqp://localhost");
    // const channel = await connection.createChannel();
    const exchange = connection.declareExchange("email-service", "topic", {durable: true});

    // await channel.assertExchange("email_service", "fanout", {durable: true});
    await connection.completeConfiguration();
    const message = new Amqp.Message(msg);
    exchange.send(message, msg.type);
    await connection.close();
    // channel.publish("email_service", "verify_account", Buffer.from(JSON.stringify(msg)));
    // await connection.close();
    // setTimeout(() => {
    //     connect.close();
    //     process.exit(0);
    //   }, 500);
}

export default publishMail;
