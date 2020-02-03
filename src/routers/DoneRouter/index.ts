import express from 'express';
import {logger} from '../../index';
import Forks, {ForksStruct} from '../../databases/models/forks';
import Users from '../../databases/models/users';

const router = express.Router();

router.put('/:forkId/:originId', async (req, res) => {
    const {forkId, originId} = req.params;
    const {email} = req.body;

    if (forkId === undefined || originId === undefined || email === undefined) {
        res.status(200).send({success: false, code: 101});
        return;
    }

    try {
        let flag = false;
        const children = await Forks.find({parent: originId});
        children.forEach((child: ForksStruct) => {
            if (!child.isDone) {
                flag = true;
                res.status(200).send({success: false, code: 502});
                return;
            }
        });

        if (flag) return;

        await Forks.updateOne({_id: forkId}, {isDone: true});

        logger.info(`${email}가 ${forkId} 복제 목표를 달성했습니다.`);
        res.status(200).send({success: true, code: 0});
    } catch (e) {
        logger.error(`${email}가 ${forkId} 복제 목표를 달성 중 오류가 발생하였습니다. \n${e}`);
        res.sendStatus(500);
    }
});

router.delete('/:forkId/:targetId', async (req, res) => {
    const {forkId, originId} = req.params;
    const {email} = req.body;

    if (forkId === undefined || originId === undefined || email === undefined) {
        res.status(200).send({success: false, code: 101});
        return;
    }

    try {
        let flag = false;
        const children = await Forks.find({parent: originId});
        children.forEach((child: ForksStruct) => {
            if (child.isDone) {
                flag = true;
                res.status(200).send({success: false, code: 503});
                return;
            }
        });

        if (flag) return;

        await Forks.updateOne({_id: forkId}, {isDone: false});

        logger.info(`${email}가 ${forkId} 복제 목표를 달성 해제했습니다.`);
        res.status(200).send({success: true, code: 0});
    } catch (e) {
        logger.error(`${email}가 ${forkId} 복제 목표를 달성 해제 중 오류가 발생하였습니다. \n${e}`);
        res.sendStatus(500);
    }
});

router.get('/user/:email', async (req, res) => {
    const {email} = req.params;

    if (email === undefined) {
        res.status(200).send({success: false, code: 101});
        return;
    }

    try {
        const userData = await Users.findOne({email});
        const data = await Forks.find({owner: userData});

        logger.info(`${email}의 달성한 복제 목표를 가져옵니다.`);
        res.status(200).send({success: true, code: 0, data});
    } catch (e) {
        logger.error(`${email}의 달성한 복제 목표를 가져오는 중 오류가 발생하였습니다. \n${e}`);
        res.sendStatus(500);
    }
});

router.get('/:forkId/:originId/:email', async (req, res) => {
    const {forkId, originId, email} = req.params;

    if (forkId === undefined || originId === undefined || email === undefined) {
        res.status(200).send({success: false, code: 101});
        return;
    }

    let count = 0;
    let node = 0;

    try {
        const rootGoal = await Forks.findOne({_id: forkId, originId});
        const isRootGoalDone = rootGoal!.isDone;

        node++;
        if (isRootGoalDone) count++;

        const rootChildren = await Forks.find({parent: originId});
        rootChildren.forEach((child: ForksStruct) => {
            node++;
            if (child.isDone) count++;
        });

        let data = (count / node);
        if (count === 0 && node === 0) data = 0;

        logger.info(`${email}이 ${forkId} 복제 목표에서 달성한 수치를 ${originId} 원본 목표 기준으로 가져옵니다.`);
        res.status(200).send({success: true, code: 0, data});
    } catch (e) {
        logger.info(`${email}이 ${forkId} 복제 목표에서 달성한 수치를 ${originId} 원본 목표 기준으로 가져오는 중 오류가 발생하였습니다. \n${e}`);
        res.sendStatus(500);
    }
});

export default router;