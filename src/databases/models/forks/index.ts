import mongoose from 'mongoose';
import {usersSchema, UsersStruct} from "../users";

export interface ForksStruct extends mongoose.Document {
    readonly originId: string;
    readonly contents: string;
    readonly level: number;
    readonly parent: string;
    readonly isDone: boolean;
    readonly owner: UsersStruct;
}

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
        type: [usersSchema]
    }
});

const forksModel = mongoose.model<ForksStruct>('forks', forksSchema);

export default forksModel;