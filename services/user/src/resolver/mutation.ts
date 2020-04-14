import bcrypt from "bcryptjs";
import { generateCookies, generateRefreshToken, refreshToken, verifyToken } from "../utils/auth";
import { badRequestError, notFoundError, serverError } from "../utils/errors/errorHandler"

export const signup = async (parent, args, {models, req, res}) => {
    try {
        console.log(args)
        const password = await bcrypt.hash(args.password, 10);
        const user = await models.user.create(args);
        generateCookies({ id: user.id }, req);
        generateRefreshToken({ id: user.id, platform: user.platform, address: user.ipAddress }, req);
        return user;
    } catch (err) {
        serverError(err, req, res);
    }

};
export const login = async ( parent, args, context) => {
    const user = await models.user.findBy({ email: args.email });
    if (!user) {
        notFoundError("User not found");
    }
    const valid = bcrypt.compare(args.password, user.password);
    if (!valid) {
        badRequestError("Invalid Password");
    }

    // check if user platform and ipaddress exists for that id. if not send an email to the user
    // tell user to confirm if he or she is logging in with a different device
    // if user verifies the  device , the platform or ipaddress that doesnt exist get added to him
    //
    // if (){

    // }
    generateCookies({ id: user.id }, context.request);
    generateRefreshToken({ id: user.id, platform: user.platform, address: user.ipAddress }, context.request);
    return user;
};

export const verifyAddress = async (parent, args, context, info)=> {

}
