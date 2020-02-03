import express from 'express';
import { logger } from '../../index';
import Goals from '../../databases/models/goals';

const router = express.Router();

router.post('/create', (req, res) => {
	const { contents, level, parent } = req.body;

	if (contents === undefined || level === undefined) {
		res.status(200).send({ success: false, code: 101 });
		return;
	}

	const levelNumber = parseInt(level);
	if (levelNumber < 0 || levelNumber > 5) {
		res.status(200).send({ success: false, code: 203 });
		return;
	}

	const obj = {
		contents,
		level,
		parent
	};

	Goals.create(obj)
		.then((data: any) => {
			logger.info(`새로운 목표를 추가하였습니다. id: ${data._id}`);
			res.status(200).send({ success: true, code: 0, id: data._id });
		})
		.catch((err: Error) => {
			logger.error(`목표 추가 중 오류가 발생하였습니다. \n${err}`);
			res.sendStatus(500);
		});
});

router.put('/:id', (req, res) => {
	const { id } = req.params;
	const { contents, level, parent } = req.body;

	if (id === undefined || contents === undefined || level === undefined) {
		res.status(200).send({ success: false, code: 101 });
		return;
	}

	const levelNumber = parseInt(level);
	if (levelNumber < 0 || levelNumber > 5) {
		res.status(200).send({ success: false, code: 203, id: null });
		return;
	}

	const obj: any = {
		contents,
		level
	};

	if (parent !== undefined) obj['parent'] = parent;

	Goals.updateOne({ _id: id }, obj)
		.then(() => {
			logger.info(`목표를 수정하였습니다. id: ${id}`);
			res.status(200).send({ success: true, code: 0 });
		})
		.catch((err: Error) => {
			logger.error(`목표 수정 중 오류가 발생하였습니다. id: ${id} \n${err}`);
			res.sendStatus(500);
		});
});

router.delete('/all/:id', (req, res) => {
	const { id } = req.params;

	if (id === undefined) {
		res.status(200).send({ success: false, code: 101 });
		return;
	}

	Goals.find({ parent: id })
		.then((data: any) => {
			data.forEach((eachData: any) => {
				Goals.deleteOne({ _id: eachData._id })
					.then(() => {})
					.catch((err: Error) => {
						logger.error(`자식 목표 삭제 중 오류가 발생하였습니다. \n${err}`);
					});
			});

			setTimeout(() => {
				Goals.deleteOne({ _id: id })
					.then(() => {
						HaveGoals.deleteOne({ target: id })
							.then(() => {
								logger.info(`목표와 목표 자식을 삭제하였습니다. id: ${id}`);
								res.status(200).send({ success: true, code: 0 });	
							});
					})
					.catch((err: Error) => {
						logger.error(`목표 삭제 중 오류가 발생하였습니다. \n${err}`);
						res.sendStatus(500);
						return;
					});			
			}, 300);
		})
		.catch((err: Error) => {
			logger.error(`자식 목표들을 가져오는 중 오류가 발생하였습니다. \n${err}`);
			res.sendStatus(500);
		});
});

router.delete('/:id', (req, res) => {
	const { id } = req.params;

	if (id === undefined) {
		res.status(200).send({ success: false, code: 101 });
		return;
	}

	Goals.find({ parent: id })
		.then((data: any) => {
			if (data.length > 0) {
				res.status(200).send({ success: true, code: 204 });
				return;
			}

			Goals.deleteOne({ _id: id })
				.then(() => {
					HaveGoals.deleteOne({ target: id }).then(() => {
						logger.info(`목표를 삭제하였습니다. id: ${id}`);
						res.status(200).send({ success: true, code: 0 });
					});
				})
				.catch((err: Error) => {
					logger.error(`목표 삭제 중 오류가 발생하였습니다. \n${err}`);
					res.sendStatus(500);
				});
		})
		.catch((err: Error) => {
			logger.error(`자식 목표들을 가져오는 중 오류가 발생하였습니다. \n${err}`);
			res.sendStatus(500);
		});
});

export default router;