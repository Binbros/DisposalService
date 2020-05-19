
import { Context } from "graphql-yoga/dist/types";
import { promisify } from 'util'
import { object } from "yup";
import helpers from "../utils";
import yup from "../validations/user.schema";

const { auth, secret, logger, verifyEmail, verifyDevice, caching } = helpers;
export const getAllUsers = async (parent: any, args: any, { models }: Context) => {
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
        const userEmailExists = await models.user.findOne({ email: args.input.email });
        const userPhoneExists = await models.user.findOne({ phoneNumber: args.input.phoneNumber });
        if (userEmailExists) {
            throw new Error("Email already exists");
        }
        if (userPhoneExists) {
            throw new Error("This Phone Number is already registered");
        }
        const user = await models.user.create(args.input);
        await models.blacklisted.create({ user: user.id, blacklistedIps: [] });
        auth.generateRefreshCookie({
            address: auth.encode({ address: user.devices[0] && user.devices[0].ipAddress, auth: user.useSecondAuth },
                secret.userSecret, { expiresIn: "30d" }),
            id: user.id,
        }, response);
        const token = auth.generateAccessToken({ id: user.id });
        verifyEmail({ firstname: user.firstName, email: user.email, type: "verify_account" }, models);
        return { user, token };
    } catch (err) {
        logger.error(err.toString());
        throw new Error(err.toString());
    }
};
export const login = async (parent: any, args: any, { models, request, response }: Context) => {
    try {
        const user = await models.user.findOne({ email: args.input.email });
        if (!user || !user.comparePassword(args.input.password)) {
            throw new Error("Invalid user login details");
        }
        const deviceExist = auth.checkIpAddresses({ devices: user.devices }, request);
        if (user.useSecondAuth && !deviceExist.status) {
            return verifyDevice({
                email: user.email, id: user.id, ipAddress: deviceExist.ip, name: user.firstname,
            }, models);
        }
        auth.generateRefreshCookie({
            address: auth.encode({ address: user.devices, auth: user.useSecondAuth }, secret.userSecret, { expiresIn: "30d" }),
            id: user.id,
        }, response,
        );
        const token = auth.generateAccessToken({ id: user.id });
        return { user, token };
    } catch (err) {
        logger.error(err.toString());
        throw new Error(err.toString());
    }
};

export const refresh = async (parent: any, args: any, { request }: Context) => {
    try {
        const ipAddress = (request.headers["x-forwarded-For"] ||
            request.connection.remoteAddress).split(",")[0].trim();
        const tokenString = request.headers.cookies.split(";")[0];
        const currentRefreshToken = tokenString.split("=")[1];
        if (!currentRefreshToken) {
            throw new Error("No Refresh Token found");
        }
        const isRefreshTokenBlacklisted = await promisify(caching.lrange("usedRefreshToken", 0, 9999999999))
        .bind(caching);
        if (isRefreshTokenBlacklisted.indexOf(currentRefreshToken) > -1) {
            throw new Error("Invalid refresh token");
        }
        // not yet implemented check if this request token has been blacklisted in redis
        // if it has not been then decoded it
        const decoded = auth.decode(currentRefreshToken, secret.refreshSecret);
        // tslint:disable-next-line: quotemark
        await caching.lpush('usedRefreshToken', decoded);
        const devices = auth.decode(decoded.address, secret.userSecret);

        // after decoding it blacklist it here, that way no one can use it again.
        if (devices.auth) {
            const deviceExist = auth.checkIpAddresses({ devices: devices.address, ipAddresses: ipAddress }, request);
            if (deviceExist.status) {
                return auth.generateAccessToken({ id: decoded.id });
            }
            throw new Error("Unverified Device");
        }
        return auth.generateAccessToken({ id: decoded.id });
    } catch (err) {
        logger.error(err.toString());
        throw new Error(err.toString());
    }
};

export const addDevice = async (parent: any, args: any, { models, request }: Context) => {
    try {
        let retrievedIp;
        const tokenFromRefreshCookie = request.headers.cookies.split(";")[0];
        const { address } = auth.decode(tokenFromRefreshCookie.split("=")[1], secret.refreshSecret);
        const savedIp = auth.decode(address, secret.userSecret);
        // get the ip address from either the argument or the  from the headers
        // when token is sent from email, we have to decode the token to get the id of the user
        if (savedIp.address.length === 0) {
            retrievedIp = (request.headers["x-forwarded-For"] ||
                request.connection.remoteAddress).split(",")[0].trim();
        }
        const decoded = auth.verifyToken(request) || auth.decode(args.token, secret.emailTokenSecret);
        // get the user details
        if (decoded) {
            const newDevice = {
                deviceName: args.deviceName,
                ipAddress: args.ipAddress || decoded.ipAddress || retrievedIp,
            };
            const user = await models.user.findById(decoded.id || args.id);
            const allIps = user.devices && user.devices.map((device: any) => device.ipAddress);
            if (!allIps.includes(newDevice.ipAddress)) {
                await models.user.updateOne({ _id: user.id }, {
                    $set: {
                        devices: [...user.devices, newDevice],
                        useSecondAuth: true,
                    },
                });
            }
            return user;
        }
    } catch (err) {
        logger.error(err.toString());
        throw new Error(err.toString());
    }
};

export const blacklistDevice = async (parent: any, args: any, { models }: Context) => {
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
export const unblockDevice = async (parent: any, args: any, { models }: Context) => {
    try {
        const decoded = auth.decode(args.token, secret.emailTokenSecret);
        const blacklist = await models.blacklisted.findById(decoded.id);
        const unblockedIp = blacklist.blacklistedIps.pop(blacklist.blacklistedIps.indexOf(decoded.ipAddress));
        models.blacklisted.update({ user: decoded.id }, { blacklistedIps: blacklist });
        return addDevice(parent, { ipAddress: unblockedIp, deviceName: args.deviceName, id: decoded.id }, { models });
    } catch (err) {
        logger.error(err.toString());
        throw new Error(err.toString());
    }
};
export const confirmMail = async (parent: any, args: any, { models }: Context) => {
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
export const retryVerify = async (parent: any, args: any, { models }: Context) => {
    try {
        await verifyEmail({ email: args.email, type: "verify_account" }, models);
        return ("Mail sent");
    } catch (err) {
        logger.error(err.toString());
        throw new Error(err.toString());
    }

};

export const forgotPassword = async (parent: any, args: any, { models }: Context) => {
    try {
        await verifyEmail({ email: args.email, type: "forgot_password" }, models);
        return ("Mail sent");
    } catch (err) {
        logger.error(err.toString());
        throw new Error(err.toString());
    }
};

export const resetPassword = async (parent: any, args: any, { models }: Context) => {
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
export const changePassword = async (parent: any, args: any, { models }: Context) => {
    const { id, password, newPassword } = args;
    try {
        const user = await models.user.findOne({ id });
        if (!user.comparePassword(password)) {
            throw new Error("Invalid password");
        }
        await models.user.updateOne({ id }, { password: newPassword });
        return user;

    } catch (err) {
        logger.error(err.toString());
        throw new Error(err.toString());
    }
};

const resolver = {
    Mutation: {
        addDevice,
        blacklistDevice,
        changePassword,
        confirmMail,
        forgotPassword,
        // updateProfile,
        login,
        // login: {
        //     resolve: login,
        //     // validateSignup: yup.login(),
        // },
        resetPassword,
        retryVerify,
        signup,
        // signup: {
        //     resolve: signup,
        //     validateSignup: yup.signup(),
        // },
        unblockDevice,
    },
    Query: {
        getAllUsers,
        refresh,
    },
};

export default resolver;

