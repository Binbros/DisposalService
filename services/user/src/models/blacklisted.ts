import mongoose, { Document, Schema } from "mongoose";

export interface IBlacklist extends Document {
    blacklistedIps:[string];
    user: number;
}

const blacklistSchema: Schema = new Schema({
    blacklistedIps: {type : Array, default: [""]},
    user: {type : String, required: true}
});

export default mongoose.model<IBlacklist>("blacklisted", blacklistSchema);

