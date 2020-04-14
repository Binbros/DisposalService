import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { Context } from "graphql-yoga/dist/types";
import jwt, { Secret } from "jsonwebtoken";
import { generateAccessToken, generateRefreshCookie, refreshToken, verifyToken } from "../utils/auth";
// import emailer from "../utils/emailer";
dotenv.config();
const userSecret = process.env.USER_SECRET as Secret;

// import { generateCookies, generateRefreshToken, refreshToken, verifyToken } from "../utils/auth";

import yup from '../validations/user.schema';


export const signup = async (parent: any, args: any, { models, request, response }: Context) => {
    try {
        const password = await bcrypt.hash(args.password, 10);
        const user = await models.user.create({ ...args, password });
        await models.blacklisted.create({ user: user.id, blacklistedIps: [] });
        const token = generateAccessToken({ id: user.id });
        generateRefreshCookie({
            address: jwt.sign({ address: [user.ipAddress] }, userSecret),
            id: user.id,
        }, response);
        return { ...user, token };
    } catch (err) {
        throw new Error(err.toString());
    }
};
export const login = async (parent: any, args: any, { models, request, response }: Context) => {
    const user = await models.user.find({ email: args.email });
    if (!user) {
        throw new Error("User not found");
    }
    const valid = bcrypt.compare(args.password, user.password);
    if (!valid) {
        throw new Error("Invalid Password");
    }
    const ipAddress = request.headers["X-Forwarded-For"].split("")[0];
    const decryptedIps = jwt.verify(args.ipAddress, userSecret) as any;
    if (!decryptedIps.address.includes(ipAddress)) {
        return verifyDevice({ ipAddress, id: user.id }, models);
    }
    const token = generateAccessToken({ id: user.id });
    generateRefreshCookie({ id: user.id, address: jwt.sign({ address: user.ipAddress }, userSecret) }, response);
    return { ...user, token };
};

export const refresh = (parent: any, args: any, { request, response }: Context) => {
    return refreshToken(args, { request, response });
};

export const addDevice = async (args: any, { models, request }: Context) => {
    const ipAddress = args.ipAddress || request.headers["X-Forwarded-For"].split("")[0] ;
    const decoded = verifyToken(request) || jwt.verify(args.token, userSecret) as any;
    const addingDevice = await models.user.findOneandupdate({ id: decoded.id || args.id},
        // need to ask vincent about this
        { useSecondAuth: true, deviceNames: args.deviceName, verifiedIps: ipAddress });
    return addingDevice;
};
export const verifyDevice = async (args: any, { models }: Context) => {
    // const user = await models.blacklisted.find({ id: args.id });
    // if(user.blacklistedIps.include(args.ipAddress)){
    //     return emailer(
    //         {
    //             button: "Unblock device",
    //             email: user.email,
    //             message: "This device has been blocked from accesing your account",
    //             extras: `If you did not try to access this account with this device kindly ignore`,
    //             // link for blocking a device
    //             // link for verifying a device
    //             links: [``, ``],
    //         },
    //     );

    // }
    // return emailer(
    //     {
    //         button: "Verify device",
    //         email: user.email,
    //         message: "A different device is trying to access your account",
    //         extras: `If you did not try to access this account kindly block the device`,
    //         // link for blocking a device
    //         // link for verifying a device
    //         links: [``, ``],
    //     },
    // );
};

export const blackListDevice = async (args: any, { models }: Context) => {
    const decoded = jwt.verify(args.token, userSecret) as any;
    const blacklistingDevice = await models.blacklisted.findOneandupdate({ user: decoded.id },
        { blacklistedIps: args.ipAddress });
    return blacklistingDevice;
};

export const unblockDevice = async (args: any, { models }: Context) => {
    const decoded = jwt.verify(args.token, userSecret) as any;
    const blacklist = await models.blacklisted.find({user: decoded.id});
    const unblockedIp = blacklist.blacklistedIps.pop( blacklist.blacklistedIps.indexOf(args.ipAddress));
    models.blacklisted.update({user: decoded.id}, {blacklistedIps : blacklist} );
    return addDevice ({ipAddress: unblockedIp, id: decoded.id}, {models});
};


const resolver = {
    Query: {
        getUser: '',
        getAllUsers: '',
        refreshToken
    },
    Mutation: {
        signup: {
            validateSignup: yup.signup(),
            resolve: signup
        },
        login: {
            validateSignup: yup.login(),
            resolve: login
        },
        addIpAddress:""
    }
}

export default resolver
