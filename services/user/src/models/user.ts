import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: number;
    password: string;
    verified: boolean;
    verifiedIp: [string];
    platforms: [string];
}

const userSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    phoneNumber: { type: Number, required: true, unique: true },
    platforms: { type: Array, required: true},
    verified: { type: Boolean, default: false },
    verifiedIps: { type: Array, required: true },
});

export default mongoose.model<IUser>("user", userSchema);

