import mongoose from 'mongoose';
import { goalsSchema } from '../goals';
import { usersSchema } from '../users';

const haveGoalsSchema = new mongoose.Schema({
	owner: {
		type: String,
		required: 'owner(email) is required'
	},
	target: {
		type: String,
		required: 'target is required'
	},
	goal: {
		type: goalsSchema
	},
	people: {
		type: [usersSchema]
	}
});

const haveGoalsModel = mongoose.model('havegoals', haveGoalsSchema);

export default haveGoalsModel;