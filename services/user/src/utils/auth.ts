import dotenv from "dotenv";
import { Context } from "graphql-yoga/dist/types";
import jwt, { Secret } from "jsonwebtoken";
import { parse } from "querystring";
import { v4 as uuidv4 } from "uuid";
import redis from "../utils/redis";
dotenv.config();

const AppSecret = process.env.APP_SECRET as Secret;
const RefreshSecret = process.env.REFRESH_SECRET as Secret;



export const generateAccessToken = (args: any) => {
    const token = jwt.sign({ id: args.id }, AppSecret, {
        expiresIn: "15m",
    });
    return token;
};
export const generateRefreshCookie = (args: any, {response}: Context ) => {
    // tslint:disable-next-line: no-shadowed-variable
    const refreshToken = jwt.sign({ id: args.id, address: args.address }, RefreshSecret, { expiresIn: "30d" });
    const auth = response.cookie("refreshtoken", refreshToken, {
        expires: "30d",
        httpOnly: true,
        secure: false,
    });
    return auth;
};
export const refreshToken = (args: any, {request, response}: Context) => {
    const tokenString =  request.headers.cookies.split(";")[0];
    const currentRefreshToken = tokenString.split("=")[1];
    if (!currentRefreshToken) {
        throw new Error ("No Refresh Token found");
    }
    generateRefreshCookie(args, response);
    return generateAccessToken(args);
};

export const verifyToken = ({request}: Context) => {
    const token = request.headers.Authorization.split("")[1];
    if (token) {
        const { id } = jwt.verify(token, AppSecret) as any;
        return id;
    }
    throw new Error("Not Authenticated");
};
