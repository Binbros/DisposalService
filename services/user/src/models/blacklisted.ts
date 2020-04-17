import mongoose, { Document, Schema } from "mongoose";

export interface IBlacklist extends Document {
    blacklistedIps:[string];
    user: string;
}

const blacklistSchema: Schema = new Schema({
    blacklistedIps: {type : Array},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
    // user: {type : String, required: true}
});

export default mongoose.model<IBlacklist>("blacklisted", blacklistSchema);

