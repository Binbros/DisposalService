import {config} from "dotenv";
import {Secret} from "jsonwebtoken";
config();
export default ({
    appSecret : process.env.APP_SECRET as Secret,
    emailTokenSecret: process.env.EMAIL_TOKEN_SECRET as Secret,
    refreshSecret: process.env.REFRESH_SECRET as Secret,
    senderEmail: process.env.SENDER_EMAIL as string,
    userSecret : process.env.USER_SECRET as Secret,
    RedisURL: process.env.REDIS_URL as string,

});
