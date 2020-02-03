import express from 'express';
import { logger } from '../../index';
import DoneGoals from '../../databases/models/donegoals';
import Goals from '../../databases/models/goals';

const router = express.Router();

const doneGoal = (res: Express.Response | any, email: string, forkId: string, targetId: string) => {
	DoneGoals.create({ email, forkId, targetId })
		.then(() => {
			logger.info(`${email} 님이 목표를 달성했습니다. forkId: ${forkId}, targetId: ${targetId}`);
			res.status(200).send({ success: true, code: 0 });
		})
		.catch((err: Error) => {
			logger.error(`목표 완료 설정 중 오류가 발생하였습니다. \n${err}`);
			res.sendStatus(500);
		});
};

router.put('/:forkId/:targetId', (req, res, next) => {
	const { forkId, targetId } = req.params;
	const { email } = req.body;

	if (forkId === undefined || targetId === undefined || email === undefined) {
		res.status(200).send({ success: false, code: 101 });
		return;
	}

	DoneGoals.findOne({ email, targetId })
		.then((findTarget: any) => {
			if (findTarget) {
				res.status(200).send({ success: false, code: 501 });
				return;
			}

			Goals.find({ parent: targetId })
				.then((data: any) => {
					let flag = false;
					if (data.length > 0) {
						data.forEach((eachData: any) => {
							DoneGoals.findOne({ email, targetId: eachData._id })
								.then((i: any) => {
									if (!flag && !i) {
										flag = true;
										res.status(200).send({ success: false, code: 502 });
									}
								})
								.catch((err: Error) => {
									logger.error(`완료 목표 자식 검사 중 오류가 발생하였습니다. \n${err}`);
									res.sendStatus(500);
								});
						});
						
						setTimeout(() => {
							if(!flag) {
								doneGoal(res, email, forkId, targetId);
							}
						}, 300);
					} else {
						doneGoal(res, email, forkId, targetId);
					}
				})
				.catch((err: Error) => {
					logger.error(`완료 목표의 자식들을 가져오는 중 오류가 발생하였습니다. \n${err}`);
					res.sendStatus(500);
				});
		})
		.catch((err: Error) => {
			logger.error(`완료 목표를 가져오는 중 오류가 발생하였습니다. \n${err}`);
			res.sendStatus(500);
		});
});

router.delete('/:forkId/:targetId', (req, res) => {
	const { forkId, targetId } = req.params;
	const { email } = req.body;

	if (forkId === undefined || targetId === undefined || email === undefined) {
		res.status(200).send({ success: false, code: 101 });
		return;
	}

	DoneGoals.deleteOne({ email, forkId, targetId })
		.then(() => {
			logger.info(`${email} 님의 목표를 달성 해제했습니다. forkId: ${forkId}, targetId: ${targetId}`);
			res.status(200).send({ success: true, code: 0 });
		})
		.catch((err: Error) => {
			logger.error(`목표 완료 설정 해제 중 오류가 발생하였습니다. \n${err}`);
			res.sendStatus(500);
		});
});

router.get('/user/:email', async (req, res) => {
	const { email } = req.params;

	if (email === undefined) {
		res.status(200).send({ success: false, code: 101 });
		return;
	}

	DoneGoals.find({ email })
		.then((data: any) => {
			logger.info(`${email} 님의 달성 목표를 가져옵니다.`);
			res.status(200).send({ success: true, code: 0, data });
		})
		.catch((err: Error) => {
			logger.error(`달성 목표를 가져오는 중 오류가 발생하였습니다. \n${err}`);
			res.sendStatus(500);
		});
});

router.get('/:forkId/:targetId/:email', (req, res) => {
	const { forkId, targetId, email } = req.params;

	if (forkId === undefined || targetId === undefined || email === undefined) {
		res.status(200).send({ success: false, code: 101, count: 0, node: 0 });
		return;
	}

	let count = 0;
	let node = 0;
	let finded = false;

	DoneGoals.find({ email, forkId }).then(findDoneGoal => {
		if(findDoneGoal.length === 0) {
			res.status(200).send({ success: true, code: 0, count: 0, node: 0 });
			return;
		}
		
		Goals.findOne({ _id: targetId }).then((data: any) => {
			if (data) count++;
			node++;

			Goals.find({ parent: targetId })
				.then((data: any) => {
					data.forEach((eachItem: any) => {
						DoneGoals.findOne({ email, targetId: eachItem._id }).then(findDoneGoal => {
							if (findDoneGoal) {
								finded = true;
								count++;
							}
						});
						node++;
					});

					setTimeout(() => {
						if (finded) {
							count--;
							node--;
						}

						logger.info(`${email} 님의 달성 정보를 가져옵니다.`);
						res.status(200).send({ success: true, code: 0, count, node });
					}, 300);
				})
				.catch((err: Error) => {
					logger.error(`달성 정보를 가져오는 중 오류가 발생하였습니다. \n${err}`);
					res.sendStatus(500);
				});
		});
	});
});

export default router;