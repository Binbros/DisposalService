const emailQueues = async(channel, queues_array , exchange_name) => {
return queues_array.forEach(queue => {
    const q = await channel.assertQueue(queue, {exclusive:true})
    channel.bindQueue(q.queue, exchange_name, queue)
})
}
export default emailQueues