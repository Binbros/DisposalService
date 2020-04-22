import bcrypt from "bcryptjs";
import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: number;
    password: string;
    verified: boolean;
    devices: [object];
    useSecondAuth: boolean;
}

const userSchema: Schema = new Schema({
    devices: { type: Array, default: [] },
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    phoneNumber: { type: Number, required: true, unique: true },
    verified: { type: Boolean, default: false },
    // tslint:disable-next-line: object-literal-sort-keys
    useSecondAuth: {type: Boolean , default: false},
});

userSchema.pre<IUser>("save", function(next) {
    if (!this.isModified("password")) { return next(); }
    const hash = bcrypt.hashSync(this.password, 10);
    this.password = hash;
    return next();
  });
userSchema.methods.comparePassword = function(password: string) {
    const user = bcrypt.compareSync(password, this.password);
    return user ? this : null;
};
export default mongoose.model<IUser>("user", userSchema);
