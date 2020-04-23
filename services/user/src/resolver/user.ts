
import { Context } from "graphql-yoga/dist/types";
import { object } from "yup";
import helpers from "../utils";
import yup from "../validations/user.schema";

const { auth, secret, logger, verifyEmail, verifyDevice } = helpers;
export const getUsers = async (parent: any, args: any, { models }: Context) => {
    try {
        const users = await models.user.find({});
        if (!users) {
            throw new Error("No user found");
        }
        return users;
    } catch (err) {
        logger.error(err.toString());
        throw new Error(err.toString());
    }
};
export const signup = async (parent: any, args: any, { models, response }: Context) => {
    try {
        // if user email already exists handle that case
        const userExists = await models.user.find({ email: args.email });
        if (userExists) {
            throw new Error("Email already exists");
        }
        const user = await models.user.create(args);
        await models.blacklisted.create({ user: user.id, blacklistedIps: [] });
        const token = auth.generateAccessToken({ id: user.id });
        auth.generateRefreshCookie({
            address: auth.encode({ address: [user.ipAddress] }, secret.userSecret, { expiresIn: "30d" }),
            id: user.id,
        }, response);
        verifyEmail({ email: user.email, type: "email.verify.account" }, models);
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
        const ipAddress = request.headers["X-Forwarded-For"].split("")[0];
        const allIps = user.devices.map((device: any) => device.ipAddress);
        if (user.useSecondAuth && !allIps.includes(ipAddress)) {
            return verifyDevice({ ipAddress, id: user.id, name: user.firstname, email: user.email }, models);
        }
        const token = auth.generateAccessToken({ id: user.id });
        auth.generateRefreshCookie({
            address: auth.encode({ address: [user.devices] }, secret.userSecret, { expiresIn: "30d" }),
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
        let retrievedIp;
        const tokenFromRefreshCookie = request.headers.cookies.split(";")[0];
        const { address } = auth.decode(tokenFromRefreshCookie.split("=")[1], secret.refreshSecret);
        const savedIps = auth.decode(address, secret.userSecret);
        // get the ip address from either the argument or the  from the headers
        // when token is sent from email, we have to decode the token to get the id of the user
        if (savedIps === "") {
            retrievedIp = request.headers["X-Forwarded-For"].split("")[0];
        }
        const decoded = auth.verifyToken(request) || auth.decode(args.token, secret.emailTokenSecret);
        // get the user details
        const newDevice = {
            deviceName: args.deviceName,
            ipAddress: args.ipAddress || decoded.ipAddress || retrievedIp,
        };
        const user = await models.user.findById(decoded.id || args.id);
        const allIps = user.devices.map((device: any) => device.ipAddress);
        if (!allIps.includes(newDevice.ipAddress)) {
            const addingDevice = await models.user.update({ id: user.id },
                {
                    devices: [...user.devices, newDevice],
                    useSecondAuth: true,
                });
            return addingDevice;
        }
    } catch (err) {
        logger.error(err.toString());
        throw new Error(err.toString());
    }
};

export const blackListDevice = async (args: any, { models }: Context) => {
    try {
        const decoded = auth.decode(args.token, secret.emailTokenSecret);
        const user = await models.blacklisted.find({ user: decoded.id });
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
        const blacklist = await models.blacklisted.findById(decoded.id);
        const unblockedIp = blacklist.blacklistedIps.pop(blacklist.blacklistedIps.indexOf(decoded.ipAddress));
        models.blacklisted.update({ user: decoded.id }, { blacklistedIps: blacklist });
        return addDevice({ ipAddress: unblockedIp, deviceName: args.deviceName, id: decoded.id }, { models });
    } catch (err) {
        logger.error(err.toString());
        throw new Error(err.toString());
    }
};
export const confirmMail = async (args: any, { models }: Context) => {
    try {
        const decoded = auth.decode(args.token, secret.emailTokenSecret);
        const verifiedUser = await models.user.findOneAndUpdate({ id: decoded.id }, {
            verified: true,
        });
        return verifiedUser;
    } catch (err) {
        logger.error(err.toString());
        throw new Error(err.toString());
    }
};
export const retryVerify = async (args: any, { models }: Context) => {
    return verifyEmail({ email: args.email, type: "verify_account" }, models);
};

export const forgotPassword = async (args: any, { models }: Context) => {
    return verifyEmail({ email: args.email, type: "forgot_password" }, models);
};

export const resetPassword = async (args: any, { models }: Context) => {
    try {
        const { password, token } = args;
        const decoded = auth.decode(token, secret.emailTokenSecret);
        const result = await models.user.findOneAndUpdate({ id: decoded.id }, { password });
        return result;
    } catch (err) {
        logger.error(err.toString());
        throw new Error(err.toString());
    }
};
export const changePassword = async (args: any, { models }: Context) => {
    const { id, password, newpassword } = args;
    try {
        const user = await models.user.find({ id });
        if (!user.comparePassword(password)) {
            throw new Error("Invalid password");
        }
        await models.user.updateOne({ id }, { password: newpassword });
        return user;

    } catch (err) {
        logger.error(err.toString());
        throw new Error(err.toString());
    }
};

const resolver = {
    Mutation: {
        addDevice,
        blackListDevice,
        changePassword,
        confirmMail,
        forgotPassword,
        login: {
            resolve: login,
            validateSignup: yup.login(),
        },
        resetPassword,
        retryVerify,
        signup: {
            resolve: signup,
            validateSignup: yup.signup(),
        },
        unblockDevice,
    },
    Query: {
        getUsers,
        refresh,
    },
};

export default resolver;
