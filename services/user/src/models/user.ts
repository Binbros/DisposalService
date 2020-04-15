import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: number;
    password: string;
    verified: boolean;
    devicesNames: [string];
    verifiedIps: [string];
}

const userSchema: Schema = new Schema({
    devicesNames: {type : Array , default: [""]},
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    phoneNumber: { type: Number, required: true, unique: true },
    verified: { type: Boolean, default: false },
    verifiedIps: { type: Array, default: [""] },
});

export default mongoose.model<IUser>("user", userSchema);

