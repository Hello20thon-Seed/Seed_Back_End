import express from 'express';
import {logger} from '../../index';
import Goals from '../../databases/models/goals';
import checkBody from "../../middlewares/CheckBody";
import checkParams from "../../middlewares/CheckParams";

const router = express.Router();

router.post('/create', checkBody, (req, res) => {
    const {contents, level, parent} = req.body;

    const levelNumber = parseInt(level);
    if (levelNumber < 0 || levelNumber > 5) {
        res.status(200).send({success: false, code: 203});
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
            res.status(200).send({success: true, code: 0, id: data._id});
        })
        .catch((err: Error) => {
            logger.error(`목표 추가 중 오류가 발생하였습니다. \n${err}`);
            res.sendStatus(500);
        });
});

router.put('/:id', (req, res) => {
    const {id} = req.params;
    const {contents, level, parent} = req.body;

    if (id === undefined || contents === undefined || level === undefined) {
        res.status(200).send({success: false, code: 101});
        return;
    }

    const levelNumber = parseInt(level);
    if (levelNumber < 0 || levelNumber > 5) {
        res.status(200).send({success: false, code: 203, id: null});
        return;
    }

    const obj: any = {
        contents,
        level
    };

    if (parent !== undefined) obj['parent'] = parent;

    Goals.updateOne({_id: id}, obj)
        .then(() => {
            logger.info(`${id} 원본 목표를 수정하였습니다.`);
            res.status(200).send({success: true, code: 0});
        })
        .catch((err: Error) => {
            logger.error(`${id} 원본 목표 수정 중 오류가 발생하였습니다.\n${err}`);
            res.sendStatus(500);
        });
});

router.delete('/all/:id', checkParams, async (req, res) => {
    const {id} = req.params;

    try {
        const children = await Goals.find({parent: id});

        for (const child of children) {
            await Goals.deleteOne({_id: child});
        }
        await Goals.deleteOne({_id: id});

        logger.info(`${id}와 그 자식 원본 목표를 모두 삭제하였습니다.`);
        res.status(200).send({success: true, code: 0});
    } catch (e) {
        logger.error(`${id}와 그 자식 원본 목표를 삭제 중 오류가 발생하였습니다. \n${e}`);
        res.sendStatus(500);
    }
});

router.delete('/:id', checkParams, async (req, res) => {
    const {id} = req.params;

    try {
        const children = await Goals.find({parent: id});

        if (children.length > 0) {
            res.status(200).send({success: true, code: 204});
            return;
        }

        await Goals.deleteOne({_id: id});

        logger.info(`${id} 원본 목표를 삭제하였습니다.`);
        res.status(200).send({success: true, code: 0});
    } catch (e) {
        logger.error(`${id} 원본 목표를 삭제하는 중 오류가 발생하였습니다. \n${e}`);
        res.sendStatus(500);
    }
});

export default router;