const forgot_password = require('./users/forgotPassWord');
const unblock_device = require("./users/unblockDevice");
const verify_device = require("./users/verifyDevice");
const verify_account = require("./users/verifyEmail");

module.exports = async (type, body) =>{
    const messages = {
        "forgot_password" : forgot_password(body),
        "unblock-device": unblock_device(body),
        "verify_device" : verify_device(body),
        "verify_account": verify_account(body)
     }
return await messages[type]
}
