import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    image?: string;
    isAdmin?: boolean;
}

export interface IUserInput {
    name: string;
    email: string;
    password: string;
    image?: string;
    isAdmin?: boolean;
}

const userSchema = new Schema<IUser>({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    image: {
        type: String,
        default: null
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const User = mongoose.model<IUser>('users', userSchema);
export default User;