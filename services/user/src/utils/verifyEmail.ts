import { Context } from "graphql-yoga/dist/types";
import publishMail from "./email";
import helpers from "./index";

const {auth, secret, logger } = helpers;

const verifyEmail = async (args: any, {models}: Context) => {
    try {
        const user = await models.user.find(args);
        if (!user || !user.email) {
            throw new Error("Invalid Email address");
        }
        const emailObj = {
            email: user.email,
            name: user.firstname,
            token: auth.encode(args, secret.emailTokenSecret, { expiresIn: "1d" }),
            type: args.type,
        };
        return publishMail(emailObj);
    } catch (err) {
        logger.error(err.toString());
        throw new Error(err.toString());
    }
};
export default verifyEmail;
