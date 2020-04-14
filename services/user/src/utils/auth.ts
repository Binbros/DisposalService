import dotenv from "dotenv";
import jwt from "jsonwebtoken"
import {v5 as uuidv5} from "uuid";
import user from "../models/user";
import redis from "./redis";

dotenv.config();
export const AppSecret = process.env.APP_SECRET;
export const RefreshSecret = process.env.REFRESH_SECRET;

export const generateCookies = (args, context) => {
    const token = jwt.sign({ userId: args.id, settings: args.userSettings }, AppSecret);
    const auth = context.res.cookie("token", token, {
        expires: "60s",
        secure: false,
        httpOnly: true,
    });
    return auth;
};

export const generateRefreshToken = (args, context) => {
    const userRefreshTokens = redis.lrange(`${args.id}`, 0, 5);
    redis.set(`${args.id}`, userRefreshTokens);
    // tslint:disable-next-line: no-shadowed-variable
    const refreshToken = jwt.sign({ userId: args.id }, RefreshSecret, { expiresIn: "30d" });
    redis.lpush(`${args.id}`, JSON.stringify({
        id: uuidv5(),
        userId: args.id,
        // tslint:disable-next-line: object-literal-sort-keys
        refreshToken,
        // only the ip to know when a different device is used
        userSettings: args.userSettings,
    }));
    return refreshToken;
};
export const refreshToken = (args, context) => {
    const userRefreshTokens = redis.lrange(`${args.id}`, 0, 5);
    if (!userRefreshTokens || !userRefreshTokens.length) {
        throw new Error("No Refresh Token found");
    }
    const currentRefreshToken = userRefreshTokens.find((userTokens) => userTokens.refreshToken === args.refreshToken);
    if (!currentRefreshToken) {
        throw new Error(`Refresh token is wrong`);
    }
    const payload = {
        userId: args.id,
        settings: args.userSettings,
    };
    generateCookies(payload, context);
    const newRefreshToken = getUpdatedRefreshToken(currentRefreshToken, payload);
    return newRefreshToken;
};
export const getUpdatedRefreshToken = (oldRefreshToken, payload) => {
    const newRefreshToken = jwt.sign(payload, RefreshSecret, { expiresIn: "30d" });
    redis.lrange(`${arg.id}`, 0, 5).map((token) => {
        if (token.refreshToken === oldRefreshToken) {
            return {
                ...token,
                refreshToken: newRefreshToken,
            };
        }
    });

    return newRefreshToken;
};
export const verifyToken = (context) => {
    const tokenString = context.headers.cookies.split(";")[0];
    const token = tokenString.split("=")[1];
    if (token) {
        const { userId } = jwt.verify(token, AppSecret);
        return userId;
    }
    throw new Error("Not Authenticated");
};
