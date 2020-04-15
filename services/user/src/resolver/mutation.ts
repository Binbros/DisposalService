import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { Context } from "graphql-yoga/dist/types";
import jwt, { Secret } from "jsonwebtoken";
import { generateAccessToken, generateRefreshCookie, refreshToken, verifyToken} from "../utils/auth";
import emailer from "../utils/emailer";
dotenv.config();
const userSecret = process.env.USER_SECRET as Secret;

export const signup = async (parent: any, args: any, { models, request, response }: Context) => {
    try {
        const password = await bcrypt.hash(args.password, 10);
        const user = await models.user.create({ ...args, password });
        const token = generateAccessToken({ id: user.id });
        generateRefreshCookie({ id: user.id, address: jwt.sign({address: [user.ipAddress]},
        userSecret)}, response);
        return {...user, token};
    } catch (err) {
        throw new Error (err.toString());
    }
};
export const login = async (parent: any, args: any, { models, request, response }: Context) => {
    const user = await models.user.find({ email: args.email });
    if (!user) {
        throw new Error ("User not found");
    }
    const valid = bcrypt.compare(args.password, user.password);
    if (!valid) {
        throw new Error("Invalid Password");
    }
    const ipAddress = request.headers["X-Forwarded-For"].split("")[0];
    const decryptedIps = jwt.verify(args.ipAddress, userSecret);
    if (!decryptedIps.address.includes(ipAddress)) {
        return verifyDevice(ipAddress);
    }
    const token = generateAccessToken({ id: user.id });
    generateRefreshCookie({ id: user.id, address: jwt.sign({address: user.ipAddress}, userSecret)}, response);
    return {...user , token };
};
export const refresh =  () => {
    
}

export const addDevice = async (parent: any, args: any , {models, request}: Context) => {
    const ipAddress = request.headers["X-Forwarded-For"].split("")[0];
    const decoded = verifyToken(request);
    const addingDevice = await models.user.findOneandupdate({id: decoded.id } ,
         {deviceNames: args.deviceName , verifiedIps: ipAddress} );

};
export const verifyDevice = async ( args: any) => {

    return emailer(
        {
            button: "verify device",
            email: user.email,
            message: "A different device is trying to login to your account",
            extras: `If you did not try to log in, block the device`,
            // link for blocking a device
            // link for verifying a device
            links: [``, ``],
        },
    );
};
export blackListDevice = async (args: any) => {

};
// export const verifyAddress = async (parent, args, context, info) => {
//     // check if the user has blacklisted that device
//     // if device is blacklisted tell user that he or she blacklisted the device
//     // send message to unblacklist the device to his email
//     // if device is not blacklisted and user tries to login with a different device for the first time
//     // send email that user should verify the device
//     // on verification it should redirect to the login page
//     // if the users does not verify then the ipaddress should be blacklisted for the user
//     // if the platform and ip address is already verified it should return true
// };
