const mail = require('../emailer')
module.exports = (channel, queues_array , exchange_name) => {
return queues_array.forEach(async queue => {
    const q = await channel.assertQueue(queue, {exclusive:false, durable:true})
    channel.bindQueue(q.queue, exchange_name, queue)
    channel.consume(q.queue, async function(msg) {
        if (msg.content) {
            const {sender, reciever, subject, body , type} = JSON.parse(msg.content)
            try {
                await mail(sender, reciever ,subject, body, type);
                channel.ack(msg)
            } catch (error) {
                channel.noack(msg)
            }
        }
    }, {noAck: true})
})
}
