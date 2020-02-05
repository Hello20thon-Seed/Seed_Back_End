import express from 'express';
import {logger} from '../../index';
import Forks, {ForksStruct} from '../../databases/models/forks';
import Users from '../../databases/models/users';
import checkParams from "../../middlewares/CheckParams";
import checkBody from "../../middlewares/CheckBody";

const router = express.Router();

router.put('/:forkId', checkParams, checkBody, async (req, res) => {
    const {forkId} = req.params;
    const {email} = req.body;

    try {
        let flag = false;
        const children = await Forks.find({parent: forkId});
        children.forEach((child: ForksStruct) => {
            if (!flag && child) {
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

router.delete('/:forkId', checkParams, checkBody, async (req, res) => {
    const {forkId} = req.params;
    const {email} = req.body;

    try {
        let flag = false;
        const children = await Forks.find({parent: forkId});
        children.forEach((child: ForksStruct) => {
            if (!flag && child) {
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

router.get('/user/:email', checkParams, async (req, res) => {
    const {email} = req.params;

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

router.get('/:forkId/:email', checkParams, async (req, res) => {
    const {forkId, email} = req.params;

    let count = 0;
    let node = 0;

    try {
        const rootChildren = await Forks.find({parent: forkId});
        rootChildren.forEach((child: ForksStruct) => {
            node++;
            if (child.isDone) count++;
        });

        let data = (count / node);
        if (count === 0 && node === 0) data = 0;

        logger.info(`${email}이 ${forkId} 복제 목표에서부터 자식까지 달성한 수치를 가져옵니다.`);
        res.status(200).send({success: true, code: 0, data});
    } catch (e) {
        logger.error(`${email}이 ${forkId} 복제 목표에서부터 자식까지 달성한 수치를 가져오는 중 오류가 발생하였습니다. \n${e}`);
        res.sendStatus(500);
    }
});

export default router;