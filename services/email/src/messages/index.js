import forgot_password from './users/forgotPassWord';
import unblock_device from "./users/unblockDevice";
import verify_device from "./users/verifyDevice";
import verify_account from "./users/verifyEmail";

const message = (type, body) =>[type](body)

export default message