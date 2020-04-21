import dotenv from "dotenv";
import {Secret} from "jsonwebtoken";
dotenv.config();
export default ({
    appSecret : process.env.APP_SECRET as Secret,
    emailTokenSecret: process.env.EMAIL_TOKEN_SECRET as Secret,
    refreshSecret: process.env.REFRESH_SECRET as Secret,
    resetPage: process.env.RESET_PAGE as Secret,
    userSecret : process.env.USER_SECRET as Secret,
});