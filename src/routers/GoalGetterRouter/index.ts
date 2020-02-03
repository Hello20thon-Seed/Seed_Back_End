import express from 'express';
import { logger } from '../../index';
import Goals from '../../databases/models/goals';

const router = express.Router();

router.get('/all', async (req, res) => {
	try {
		const allGoals = Goals.find({});

		logger.info('모든 원본 목표를 가지고옵니다.');
		res.status(200).send({success: true, code: 0, data: allGoals});
	} catch (e) {
		logger.error(`모든 원본 목표들을 가져오는 중 오류가 발생하였습니다. \n${e}`);
		res.sendStatus(500);
	}
});

router.get('/:id', async (req, res) => {
	const { id } = req.params;

	if (id === undefined) {
		res.status(200).send({ success: false, code: 101 });
		return;
	}

	try {
		const goal = await Goals.findOne({ _id: id });

		logger.info(`${id} 원본 목표를 가져옵니다.`);
		res.status(200).send({ success: true, code: 0, data: goal });
	} catch (e) {
		logger.error(`${id} 원본 목표를 가져오는 중 오류가 발생하였습니다. \n${e}`);
		res.sendStatus(500);
	}
});

router.get('/children/:id', async (req, res) => {
	const { id } = req.params;

	if (id === undefined) {
		res.status(200).send({ success: false, code: 101 });
		return;
	}

	try {
		const children = await Goals.find({ parent: id });

		logger.info(`${id} 부모 원본 목표의 자식 원본 목표를 모두 가져옵니다.`);
		res.status(200).send({ success: true, code: 0, data: children });
	} catch (e) {
		logger.error(`${id} 부모 원본 목표의 자식 원본 목표를 모두 가져오는 중 오류가 발생하였습니다. \n${e}`);
		res.sendStatus(500);
	}
});

router.get('/parent/:id', async (req, res) => {
	const { id } = req.params;

	if (id === undefined) {
		res.status(200).send({ success: false, code: 101 });
		return;
	}

	try {
		const child = await Goals.findOne({ _id: id });
		const parentId = child!.parent;
		const parent = await Goals.findOne({ _id: parentId });

		logger.info(`${id} 자식 원본 목표의 부모 원본 목표를 가져옵니다.`);
		res.status(200).send({ success: true, code: 0, data: parent });
	} catch (e) {
		logger.error(`${id} 자식 원본 목표의 부모 원본 목표를 가져오는 중 오류가 발생하였습니다.`);
		res.sendStatus(500);
	}
});

export default router;