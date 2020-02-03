import express from 'express';
import { logger } from '../../index';
import Goals from '../../databases/models/goals';

const router = express.Router();

router.get('/all', (req, res) => {
	Goals.find({})
		.then((data: any) => {
			res.status(200).send({ success: true, code: 0, data });
		})
		.catch((err: Error) => {
			logger.error(`모든 목표들을 가져오는 중 오류가 발생하였습니다. \n${err}`);
			res.sendStatus(500);
		});
});

router.get('/:id', (req, res) => {
	const { id } = req.params;

	if (id === undefined) {
		res.status(200).send({ success: false, code: 101, data: null });
		return;
	}

	Goals.findOne({ _id: id })
		.then((data: any) => {
			res.status(200).send({ success: true, code: 0, data });
		})
		.catch((err: Error) => {
			logger.error(`목표를 가져오는 중 오류가 발생하였습니다. \n${err}`);
			res.sendStatus(500);
		});
});

router.get('/children/:id', (req, res) => {
	const { id } = req.params;

	if (id === undefined) {
		res.status(200).send({ success: false, code: 101, data: null });
		return;
	}

	Goals.find({ parent: id })
		.then((data: any) => {
			res.status(200).send({ success: true, code: 0, data: data });
		})
		.catch((err: Error) => {
			logger.error(`자식 목표들을 가져오는 중 오류가 발생하였습니다. \n${err}`);
			res.sendStatus(500);
		});
});

router.get('/parent/:id', (req, res) => {
	const { id } = req.params;

	if (id === undefined) {
		res.status(200).send({ success: false, code: 101, id: null });
		return;
	}

	Goals.findOne({ _id: id })
		.then((data: any) => {
			const parentId = data.parent;
		
			Goals.findOne({ _id: parentId })
				.then((data: any) => {
					res.status(200).send({ success: true, code: 0, data });
				})
				.catch((err: Error) => {
					logger.error(`부모 목표를 가져오는 중 오류가 발생하였습니다. \n${err}`);
					res.sendStatus(500);
				})
		})
		.catch((err: Error) => {
			logger.error(`부모 목표를 찾는 중 오류가 발생하였습니다. \n${err}`);
			res.sendStatus(500);
		});
});

export default router;