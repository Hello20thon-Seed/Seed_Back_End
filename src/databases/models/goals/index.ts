import mongoose from 'mongoose';
import {usersSchema, UsersStruct} from "../users";

export interface GoalsStruct extends mongoose.Document {
	readonly contents: string;
	readonly level: number;
	readonly parent: string;
	readonly members: Array<UsersStruct>;
}

export const goalsSchema: mongoose.Schema = new mongoose.Schema({
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
    members: {
        type: [usersSchema]
    }
});

const goalsModel = mongoose.model<GoalsStruct>('goals', goalsSchema);

export default goalsModel;