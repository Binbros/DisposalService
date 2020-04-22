import { Context } from "graphql-yoga/dist/types";
import publishMail from "./email";
import helpers from "./index";

const {auth, secret } = helpers;
const verifyDevice = async (args: any, { models }: Context) => {
    const user = await models.blacklisted.find({ user: args.id });
    const emailObj = {
        email: args.email,
        name: args.firstname,
        token: auth.encode({id: args.id}, secret.emailTokenSecret, { expiresIn: "1d" }),
    };
    if (user.blacklistedIps.include(args.ipAddress)) {
        return publishMail({ ...emailObj, type: "email.unblock.device" });
    }
    return publishMail({ ...emailObj, type: "email.verify.device" });

};

export default verifyDevice;
