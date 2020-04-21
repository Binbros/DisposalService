
import { Context } from "graphql-yoga/dist/types";
import email from "../publish/email.mq";
import helpers from "../utils";
import yup from "../validations/user.schema";

const { auth, secret, logger } = helpers;

export const signup = async (parent: any, args: any, { models, request, response }: Context) => {
    try {
        const user = await models.user.create(args);
        await models.blacklisted.create({ user: user.id, blacklistedIps: [] });
        const token = auth.generateAccessToken({ id: user.id });
        auth.generateRefreshCookie({
            address: auth.encode({ address: [user.ipAddress] }, secret.userSecret, { expiresIn: "30d" }),
            id: user.id,
        }, response);
        const emailObj = {
            email: user.email,
            link: "you put the link here",
            name: user.firstname, 
        };
        await email(emailObj);
        return { ...user, token };
    } catch (err) {
        logger.error(err.toString());
        throw new Error(err.toString());
    }
};
export const login = async (parent: any, args: any, { models, request, response }: Context) => {
    try {
        const user = await models.user.find({ email: args.email });
        if (!user || !user.comparePassword(args.password)) {
            throw new Error("Invalid user login details");
        }
        // get the ip address from the header
        const ipAddress = request.headers["X-Forwarded-For"].split("")[0];
        // if the user stored ipAddress does not include the ip from the headers
        if (!user.ipAddress.includes(ipAddress)) {
            return verifyDevice({ ipAddress, id: user.id }, models);
        }
        const token = auth.generateAccessToken({ id: user.id });
        auth.generateRefreshCookie({
            address: auth.encode({ address: [user.ipAddress] }, secret.userSecret, { expiresIn: "30d" }),
            id: user.id,
        },
            response);
        return { ...user, token };
    } catch (err) {
        logger.error(err.toString());
        throw new Error(err.toString());
    }
};

export const refresh = (parent: any, args: any, { request, response }: Context) => {
    return auth.refreshToken(args, { request, response });
};

export const addDevice = async (args: any, { models, request }: Context) => {
    try {
        // get the ip address from either the argument or the  from the headers
        // when token is sent from email, we have to decode the token to get the id of the user
        const ipAddress = args.ipAddress || request.headers["X-Forwarded-For"].split("")[0];
        const decoded = auth.verifyToken(request) || auth.decode(args.token, secret.emailTokenSecret);
        // get the user details
        const user = await models.user.find({ id: decoded.id || args.id });
        const addingDevice = await models.user.update({ id: user.id },
            {
                deviceNames: [...user.deviceNames, args.deviceName],
                useSecondAuth: true,
                verifiedIps: [...user.verifiedIps, ipAddress],
            });
        return addingDevice;
    } catch (err) {
        logger.error(err.toString());
        throw new Error(err.toString());
    }
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
    try {
        const decoded = auth.decode(args.token, secret.emailTokenSecret);
        const user = await models.blacklisted.findOne({ user: decoded.id });
        const blacklistingDevice = await models.blacklisted.update({ user: user.id },
            { blacklistedIps: [...user.blacklistedIps, decoded.ipAddress] });
        return blacklistingDevice;
    } catch (err) {
        logger.error(err.toString());
        throw new Error(err.toString());
    }
};

export const unblockDevice = async (args: any, { models }: Context) => {
    try {
        const decoded = auth.decode(args.token, secret.emailTokenSecret);
        const blacklist = await models.blacklisted.find({ user: decoded.id });
        const unblockedIp = blacklist.blacklistedIps.pop(blacklist.blacklistedIps.indexOf(decoded.ipAddress));
        models.blacklisted.update({ user: decoded.id }, { blacklistedIps: blacklist });
        return addDevice({ ipAddress: unblockedIp, id: decoded.id }, { models });
    } catch (err) {
        logger.error(err.toString());
        throw new Error(err.toString());
    }
};
export const 

const resolver = {
    Mutation: {
        addDevice,
        blackListDevice,
        login: {
            resolve: login,
            validateSignup: yup.login(),
        },
        signup: {
            resolve: signup,
            validateSignup: yup.signup(),
        },
        unblockDevice,
        verifyDevice,

    },
    Query: {
        getAllUsers: "",
        getUser: "",
        refresh,
    },
};

export default resolver ;
