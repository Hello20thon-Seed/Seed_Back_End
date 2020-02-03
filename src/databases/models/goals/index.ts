import mongoose from 'mongoose';

export const goalsSchema = new mongoose.Schema({
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
	}
});

const goalsModel = mongoose.model('goals', goalsSchema);

export default goalsModel;