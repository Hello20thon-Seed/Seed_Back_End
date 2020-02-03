import mongoose from 'mongoose';
import {forksSchema, ForksStruct} from "../forks";

export interface UsersStruct extends mongoose.Document {
	readonly email: string;
	readonly nickname: string;
	readonly profile: number;
	readonly goal: Array<ForksStruct>;
}

export const usersSchema: mongoose.Schema = new mongoose.Schema({
    email: {
        type: String,
        required: 'email is required'
    },
    nickname: {
        type: String,
        required: 'nickname is required'
    },
    profile: {
        type: String,
        required: 'profile is required'
    },
    goal: {
        type: [forksSchema]
    }
});

const usersModel = mongoose.model<UsersStruct>('users', usersSchema);

export default usersModel;