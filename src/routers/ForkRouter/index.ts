import express from 'express';
import { logger } from '../../index';
import Forks, {ForksStruct} from '../../databases/models/forks';
import Goals from '../../databases/models/goals';
import Users, {UsersStruct} from '../../databases/models/users';

const router = express.Router();

router.post('/create', async (req, res) => {
	const { id, owner } = req.body;

	if (id === undefined || owner === undefined) {
		res.status(200).send({ success: false, code: 101 });
		return;
	}

	try {
		const ownerData = await Users.findOne({ email: owner });
		const originGoal = await Goals.findOne({ _id: id });
		const { contents, level, parent } = originGoal!;
		const createData = {
			origin: id,
			contents,
			level,
			parent,
			isDone: false,
			owner: ownerData
		};

		const forkGoal = await Forks.create(createData);

		const prevUserGoal: Array<ForksStruct> = ownerData!.goal;
		prevUserGoal.push(forkGoal);

		await Users.updateOne({ email: owner }, { goal: prevUserGoal });

		logger.info(`${owner}를 주인으로 ${id} 원본 목표를 복제하였습니다.`);
		res.status(200).send({ success: true, code: 0, id: forkGoal._id });
	} catch (e) {
		logger.error(`${owner}를 주인으로 ${id} 원본 목표를 복제 중 오류가 발생하였습니다. \n${e}`);
		res.sendStatus(500);
	}
});

router.get('/all/:owner', async (req, res) => {
	const { owner } = req.params;

	if (owner === undefined) {
		res.status(200).send({ success: false, code: 101 });
		return;
	}

	try {
		const userData = await Users.findOne({ email: owner });
		const forkGoals = await Forks.find({ owner: userData });

		logger.info(`${owner}의 모든 복제 목표를 가져옵니다.`);
		res.status(200).send({ success: true, code: 0, data: forkGoals });
	} catch (e) {
		logger.error(`${owner}의 모든 복제 목표를 가져오는 중 오류가 발생하였습니다. \n${e}`);
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
		const forkGoal = await Forks.findOne({ _id: id });
		logger.info(`${id} 복제 목표를 가져옵니다.`);
		res.status(200).send({ success: true, code: 0, data: forkGoal });
	} catch (e) {
		logger.error(`${id} 복제 목표를 가져오는 중 오류가 발생하였습니다. \n${e}`);
		res.sendStatus(500);
	}
});

router.get('/filter/:id/:email', async (req, res) => {
	const { id, email } = req.params;

	if (id === undefined || email == undefined) {
		res.status(200).send({ success: false, code: 101, data: null });
		return;
	}

	try {
		const userData = await Users.findOne({ email });
		const filteringForkGoal = await Forks.findOne({ originId: id, owner: userData });

		logger.info(`${email}, ${id}를 가진 복제 목표를 가져옵니다.`);
		res.status(200).send({ success: true, code: 0, data: filteringForkGoal });
	} catch (e) {
		logger.error(`${email}, ${id}를 가진 복제 목표를 가져오는 중 오류가 발생하였습니다. \n${e}`);
		res.sendStatus(500);
	}
});

router.get('/user/:id', async (req, res) => {
	const { id } = req.params;

	if (id === undefined) {
		res.status(200).send({ success: false, code: 101 });
		return;
	}

	try {
		const forkList = await Forks.find({ originId: id });
		const doForkUsers: Array<UsersStruct> = [];

		forkList.forEach((fork: ForksStruct) => {
			doForkUsers.push(fork.owner);
		});

		logger.info(`${id} 원본 목표를 복제한 모든 유저를 가져옵니다.`);
		res.status(200).send({ success: true, code: 0, data: doForkUsers });
	} catch (e) {
		logger.error(`${id} 원본 목표를 복제한 모든 유저를 가져오는 중 오류가 발생하였습니다.`);
		res.sendStatus(500);
	}
});

router.delete('/:id', async (req, res) => {
	const { id } = req.params;

	if (id === undefined) {
		res.status(200).send({ success: false, code: 101, data: null });
		return;
	}

	try {
		await Forks.deleteOne({ _id: id });
		logger.info(`${id} 복제 목표를 삭제하였습니다.`);
		res.status(200).send({ success: true, code: 0 });
	} catch (e) {
		logger.error(`${id} 복제 목표를 삭제 중 오류가 발생하였습니다. \n${e}`);
		res.sendStatus(500);
	}
});

export default router;