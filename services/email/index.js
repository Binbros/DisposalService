const email = require('./src/subscribeEmails');

email().then((res) => console.log(res)).catch(err=> console.error(err))