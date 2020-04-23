import { Context } from "graphql-yoga/dist/types";
import * as auth from "./auth";
import publishMail from "./email";
import secret from "./secret";

const verifyDevice = async (args: any, { models }: Context) => {
    const user = await models.blacklisted.find({ user: args.id });
    const emailObj = {
        body : {
            firstToken: auth.encode({id: args.id, ipAddress: args.ipAddress},
                secret.emailTokenSecret, { expiresIn: "1d" }) as string,
            name: args.firstname as string,
            secondToken: auth.encode({id: args.id, ipAddress: args.ipAddress}, secret.emailTokenSecret, { expiresIn: "7d" }) as string,
        },
        reciever : args.email,
        sender: `${secret.senderEmail}`,
    };
    if (user.blacklistedIps.include(args.ipAddress)) {
        return publishMail({ ...emailObj, subject: "Device Unblocking Request", type: "unblock_device" });
    }
    return publishMail({ ...emailObj, subject: "Device Verification Request", type: "verify_device" });

};

export default verifyDevice;
