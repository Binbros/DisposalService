import { Context } from "graphql-yoga/dist/types";
import * as auth from "./auth";
import publishMail from "./email";
import logger from "./logger"
import secret from "./secret";

const verifyEmail = async (args: any, {models}: Context) => {
    try {
        const user = await models.user.find(args);
        if (!user || !user.email) {
            throw new Error("Invalid Email address");
        }
        const emailObj = {
            body : {
                name: args.firstname,
                token: auth.encode({id: args.id}, secret.emailTokenSecret, { expiresIn: "1d" }),
            },
            reciever : args.email,
            sender: `${secret.senderEmail}`,
            subject: "Account Verification",
            type: args.type,
        };
        return publishMail(emailObj);
    } catch (err) {
        logger.error(err.toString());
        throw new Error(err.toString());
    }
};
export default verifyEmail;
