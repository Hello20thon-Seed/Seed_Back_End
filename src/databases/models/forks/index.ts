import mongoose from 'mongoose';
import {usersSchema} from "../users";

export const forksSchema: mongoose.Schema = new mongoose.Schema({
    originId: {
        type: String,
        required: 'originId is required'
    },
    contents: {
        type: String,
        required: 'contents is required'
    },
    level: {
        type: Number,
        required: 'level is required'
    },
    parent: {
        type: String,
        default: null
    },
    isDone: {
        type: Boolean,
        default: false
    },
    owner: {
        type: usersSchema
    }
});

const forksModel = mongoose.model('forks', forksSchema);

export default forksModel;