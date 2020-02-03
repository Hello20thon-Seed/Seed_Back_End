import mongoose from 'mongoose';
import {forksSchema} from "../forks";

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

const usersModel = mongoose.model('users', usersSchema);

export default usersModel;