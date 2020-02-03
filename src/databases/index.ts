import { logger } from '../index';
import mongoose from 'mongoose';

export default () => {
	mongoose.connect(
		`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env
			.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`,
		{
			useNewUrlParser: true,
			useFindAndModify: false
		}
	);

	const db = mongoose.connection;

	const handleOpen = () => logger.info('connected to mongodb');
	const handleError = (err: Error) => logger.error(`error on mongodb connection \n${err}`);

	db.once('open', handleOpen);
	db.on('error', handleError);
};