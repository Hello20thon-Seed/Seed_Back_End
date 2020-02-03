import mongoose from 'mongoose';

export const usersSchema = new mongoose.Schema({
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
	}
});

const usersModel = mongoose.model('users', usersSchema);

export default usersModel;