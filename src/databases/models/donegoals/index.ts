import mongoose from 'mongoose';

export const doneGoalsSchema = new mongoose.Schema({
	email: {
		type: String,
		required: 'email is required'
	},
	forkId: {
		type: String,
		required: 'forkId is required'
	},
	targetId: {
		type: String,
		doneId: 'forkId is required'
	}
});

const doneGoalsModel = mongoose.model('donegoals', doneGoalsSchema);

export default doneGoalsModel;