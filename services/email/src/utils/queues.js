const mail = require('../emailer')
module.exports = (channel, queues_array , exchange_name) => {
return queues_array.forEach(async queue => {
    const q = await channel.assertQueue(queue, {exclusive:false, durable:true})
    channel.prefetch(1);
    channel.bindQueue(q.queue, exchange_name, queue)
    return channel.consume(q.queue, async function(msg) {
        if (msg.content) {
            const {sender, reciever, subject, body , type} = JSON.parse(msg.content)
            await mail(sender, reciever ,subject, body, type);
        }
    }, {noAck: true})
})
}
