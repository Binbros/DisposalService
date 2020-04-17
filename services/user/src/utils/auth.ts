
import { Context } from "graphql-yoga/dist/types";
import jwt, {Secret} from "jsonwebtoken";
import helpers from "./index";

const {appSecret, refreshSecret} = helpers.secret;

export const encode  =  (args: any, secret: Secret , options: object) => {
    return jwt.sign(args, secret, options) as any;
};
export const decode = (args: any, secret: Secret) => {
    return jwt.verify(args, secret) as any;
};
export const generateAccessToken = (args: any) => {
    const token = encode(args, appSecret, {expiresIn: "15m"});
    return token;
};
export const generateRefreshCookie = (args: any, {response}: Context ) => {
    // tslint:disable-next-line: no-shadowed-variable
    const refreshToken = encode(args, refreshSecret, { expiresIn: "30d" });
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
        const { id } = decode(token, appSecret) as any;
        return id;
    }
    throw new Error("Not Authenticated");
};
