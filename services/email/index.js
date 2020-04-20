const email = require('./consumer/email.consumer');

email().then((res) => console.log(res)).catch(err=> console.error(err))