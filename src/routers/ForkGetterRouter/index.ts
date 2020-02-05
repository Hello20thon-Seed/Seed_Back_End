
import express from 'express';
import {logger} from '../../index';
import Forks, {ForksStruct} from '../../databases/models/forks';
import Users, {UsersStruct} from '../../databases/models/users';
import checkParams from "../../middlewares/CheckParams";

const router = express.Router();

router.get('/all/:owner', checkParams, async (req, res) => {
    const {owner} = req.params;

    try {
        const userData = await Users.findOne({email: owner});
        const forkGoals = await Forks.find({owner: userData, level: 0});

        logger.info(`${owner}의 모든 복제 목표를 가져옵니다.`);
        res.status(200).send({success: true, code: 0, data: forkGoals});
    } catch (e) {
        logger.error(`${owner}의 모든 복제 목표를 가져오는 중 오류가 발생하였습니다. \n${e}`);
        res.sendStatus(500);
    }
});

router.get('/:id', checkParams, async (req, res) => {
    const {id} = req.params;

    try {
        const forkGoal = await Forks.findOne({_id: id});
        logger.info(`${id} 복제 목표를 가져옵니다.`);
        res.status(200).send({success: true, code: 0, data: forkGoal});
    } catch (e) {
        logger.error(`${id} 복제 목표를 가져오는 중 오류가 발생하였습니다. \n${e}`);
        res.sendStatus(500);
    }
});

router.get('/filter/:id/:email', checkParams, async (req, res) => {
    const {id, email} = req.params;

    try {
        const userData = await Users.findOne({email});
        const filteringForkGoal = await Forks.findOne({originId: id, owner: userData});

        logger.info(`${email}, ${id}를 가진 복제 목표를 가져옵니다.`);
        res.status(200).send({success: true, code: 0, data: filteringForkGoal});
    } catch (e) {
        logger.error(`${email}, ${id}를 가진 복제 목표를 가져오는 중 오류가 발생하였습니다. \n${e}`);
        res.sendStatus(500);
    }
});

router.get('/user/:id', checkParams, async (req, res) => {
    const {id} = req.params;

    try {
        const forkList = await Forks.find({originId: id});
        const doForkUsers: Array<UsersStruct> = [];

        forkList.forEach((fork: ForksStruct) => {
            doForkUsers.push(fork.owner);
        });

        logger.info(`${id} 원본 목표를 복제한 모든 유저를 가져옵니다.`);
        res.status(200).send({success: true, code: 0, data: doForkUsers});
    } catch (e) {
        logger.error(`${id} 원본 목표를 복제한 모든 유저를 가져오는 중 오류가 발생하였습니다.`);
        res.sendStatus(500);
    }
});

router.get('/children/:id', checkParams, async (req, res) => {
    const {id} = req.params;

    try {
        const children = await Forks.find({parent: id});

        logger.info(`${id} 부모 복제 목표의 자식 복제 목표를 모두 가져옵니다.`);
        res.status(200).send({success: true, code: 0, data: children});
    } catch (e) {
        logger.error(`${id} 부모 복제 목표의 자식 복제 목표를 모두 가져오는 중 오류가 발생하였습니다. \n${e}`);
        res.sendStatus(500);
    }
});

router.get('/parent/:id', checkParams, async (req, res) => {
    const {id} = req.params;

    try {
        const child = await Forks.findOne({_id: id});
        const parentId = child!.parent;
        const parent = await Forks.findOne({_id: parentId});

        logger.info(`${id} 자식 복제 목표의 부모 복제 목표를 가져옵니다.`);
        res.status(200).send({success: true, code: 0, data: parent});
    } catch (e) {
        logger.error(`${id} 자식 복제 목표의 부모 복제 목표를 가져오는 중 오류가 발생하였습니다.`);
        res.sendStatus(500);
    }
});

export default router;