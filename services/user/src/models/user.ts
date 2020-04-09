import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: number,
    verified: boolean
}

const userSchema: Schema = new Schema({
    email: {type: String, required: true, unique: true},
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: {type: Number, required: true, unique: true},
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
});

export default mongoose.model<IUser>('user', userSchema);