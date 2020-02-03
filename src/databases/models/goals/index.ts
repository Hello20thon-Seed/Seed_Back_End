import mongoose from 'mongoose';
import { usersSchema } from "../users";

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

const goalsModel = mongoose.model('goals', goalsSchema);

export default goalsModel;