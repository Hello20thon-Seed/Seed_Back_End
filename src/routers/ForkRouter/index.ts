import express from 'express';
import { logger } from '../../index';
import HaveGoals from '../../databases/models/havegoals';
import Goals from '../../databases/models/goals';
import Users from '../../databases/models/users';

const router = express.Router();

router.post('/create', async (req, res) => {
	const { id, owner } = req.body;

	if (id === undefined || owner === undefined) {
		res.status(200).send({ success: false, code: 101, id: null });
		return;
	}

	const obj: any = {
		target: id,
		owner,
		goal: await Goals.findOne({ _id: id })
	};

	Users.findOne({ email: owner })
		.then((data: any) => {
			obj['people'] = [data];

			HaveGoals.findOne({ owner })
				.then((data: any) => {
					if (data && data.target === id) {
						res.status(200).send({ success: false, code: 401, id: null });
						return;
					}

					HaveGoals.create(obj)
						.then((data: any) => {
							logger.info(`${owner} 님이 ${id} 목표를 복제하였습니다. fork id: ${data._id}`);
							res.status(200).send({ success: true, code: 0, id: data._id });
						})
						.catch((err: Error) => {
							logger.error(`목표 복제 중 오류가 발생하였습니다. \n${err}`);
							res.sendStatus(500);
						});
				})
				.catch((err: Error) => {
					logger.error(`목표 복제 확인 중 오류가 발생하였습니다. \n${err}`);
					res.sendStatus(500);
				});
		})
		.catch((err: Error) => {
			logger.error(`목표 복제 주인을 가져오는 중 오류가 발생하였습니다. \n${err}`);
			res.sendStatus(500);
		});
});

router.get('/all/:owner', async (req, res) => {
	const { owner } = req.params;

	if (owner === undefined) {
		res.status(200).send({ success: false, code: 101, data: null });
		return;
	}

	HaveGoals.find({ owner })
		.then((data: any) => {
			logger.info(`${owner} 님의 모든 복제 목표를 가져옵니다.`);
			res.status(200).send({ success: true, code: 0, data });
		})
		.catch((err: Error) => {
			logger.error(`복제 목표를 가져오는 중 오류가 발생하였습니다. \n${err}`);
			res.sendStatus(500);
		});
});

router.get('/:id', async (req, res) => {
	const { id } = req.params;

	if (id === undefined) {
		res.status(200).send({ success: false, code: 101, data: null });
		return;
	}

	HaveGoals.findOne({ _id: id })
		.then((data: any) => {
			logger.info(`복제 목표를 가져옵니다. id: ${id}`);
			res.status(200).send({ success: true, code: 0, data });
		})
		.catch((err: Error) => {
			logger.error(`복제 목표 가져오는 중 오류가 발생하였습니다. \n${err}`);
			res.sendStatus(500);
		});
});

router.get('/with/:id/:email', async (req, res) => {
	const { id, email } = req.params;

	if (id === undefined || email == undefined) {
		res.status(200).send({ success: false, code: 101, data: null });
		return;
	}

	HaveGoals.findOne({ target: id, owner: email })
		.then((data: any) => {
			logger.info(`복제 목표를 가져옵니다. id: ${id}`);
			res.status(200).send({ success: true, code: 0, data });
		})
		.catch((err: Error) => {
			logger.error(`복제 목표 가져오는 중 오류가 발생하였습니다. \n${err}`);
			res.sendStatus(500);
		});
});

router.delete('/:id', async (req, res) => {
	const { id } = req.params;

	if (id === undefined) {
		res.status(200).send({ success: false, code: 101, data: null });
		return;
	}

	HaveGoals.deleteOne({ _id: id })
		.then(() => {
			logger.info(`복제 목표를 삭제하였습니다. id: ${id}`);
			res.status(200).send({ success: true, code: 0 });
		})
		.catch((err: Error) => {
			logger.error(`복제 목표 삭제 중 오류가 발생하였습니다. \n${err}`);
			res.sendStatus(500);
		});
});

router.get('/user/:id', async (req, res) => {
	const { id } = req.params;

	if (id === undefined) {
		res.status(200).send({ success: false, code: 101 });
		return;
	}

	HaveGoals.find({ target: id })
		.then((data: any) => {
			const arr: Array<string> = [];
			data.forEach((eachItem: any) => {
				arr.push(eachItem.owner);
			});
			logger.info(`목표를 복제한 유저 email을 가져옵니다. id: ${id}`);
			res.status(200).send({ success: true, code: 0, data: arr });
		})
		.catch((err: Error) => {
			logger.error(`복제 목표를 가져오는 중 오류가 발생하였습니다. \n${err}`);
			res.sendStatus(500);
		});
});

router.get('/people/:id', async (req, res) => {
	const { id } = req.params;

	if (id === undefined) {
		res.status(200).send({ success: false, code: 101 });
		return;
	}

	HaveGoals.findOne({ _id: id })
		.then((data: any) => {
			logger.info(`복제 목표에 초대된 사람들을 가져왔습니다. id: ${id}`);
			res.status(200).send({ success: true, code: 0, data: data.people });
		})
		.catch((err: Error) => {
			logger.error(`복제 목표를 가져오는 중 오류가 발생하였습니다. \n${err}`);
			res.sendStatus(500);
		});
});

router.put('/people/:id', async (req, res) => {
	const { id } = req.params;
	const { email } = req.body;

	if (id === undefined || email === undefined) {
		res.status(200).send({ success: false, code: 101 });
		return;
	}

	HaveGoals.findOne({ _id: id })
		.then((prevGoal: any) => {
			Users.findOne({ email })
				.then((findUserData: any) => {
					if (!findUserData) {
						res.status(200).send({ success: false, code: 301 });
						return;
					}

					const cond = prevGoal.people.find(
						(item: any) => JSON.stringify(item) === JSON.stringify(findUserData)
					);

					if (cond) {
						res.status(200).send({ success: false, code: 402 });
						return;
					}

					const tempPeople = prevGoal.people;
					tempPeople.push(findUserData);

					HaveGoals.updateOne({ _id: id }, { people: tempPeople })
						.then(() => {
							logger.info(`복제 목표에 ${email} 유저를 초대하였습니다. id: ${id}`);
							res.status(200).send({ success: true, code: 0 });
						})
						.catch((err: Error) => {
							logger.error(`유저 초대 중 오류가 발생하였습니다. id: ${id} \n${err}`);
							res.sendStatus(500);
						});
				})
				.catch((err: Error) => {
					logger.error(`초대할 대상을 가져오는 중 오류가 발생하였습니다. \n${err}`);
					res.sendStatus(500);
				});
		})
		.catch((err: Error) => {
			logger.error(`초대할 복제 목표를 가져오는 중 오류가 발생하였습니다. \n${err}`);
			res.sendStatus(500);
		});
});

router.delete('/people/:id', async (req, res) => {
	const { id } = req.params;
	const { email } = req.body;

	if (id === undefined || email === undefined) {
		res.status(200).send({ success: false, code: 101 });
		return;
	}

	HaveGoals.findOne({ _id: id })
		.then((prevGoal: any) => {
			Users.findOne({ email })
				.then((findUserData: any) => {
					const tempPeople = prevGoal.people;
					const deleteIndex = tempPeople.findIndex(
						(item: object) => JSON.stringify(item) === JSON.stringify(findUserData)
					);
					logger.debug(deleteIndex);
					if (deleteIndex === -1) {
						res.status(200).send({ success: false, code: 301 });
						return;
					}

					tempPeople.splice(deleteIndex, 1);

					HaveGoals.updateOne({ _id: id }, { people: tempPeople })
						.then(() => {
							logger.info(`복제 목표에 ${email} 유저를 초대 삭제하였습니다. id: ${id}`);
							res.status(200).send({ success: true, code: 0 });
						})
						.catch((err: Error) => {
							logger.error(`유저 초대 삭제 중 오류가 발생하였습니다. id: ${id} \n${err}`);
							res.sendStatus(500);
						});
				})
				.catch((err: Error) => {
					logger.error(`초대 삭제할 대상을 가져오는 중 오류가 발생하였습니다. \n${err}`);
					res.sendStatus(500);
				});
		})
		.catch((err: Error) => {
			logger.error(`초대 삭제할 복제 목표를 가져오는 중 오류가 발생하였습니다. \n${err}`);
			res.sendStatus(500);
		});
});

export default router;