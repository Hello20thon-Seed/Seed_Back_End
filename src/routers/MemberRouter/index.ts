import express from 'express';
import {logger} from '../../index';
import Goals from '../../databases/models/goals';
import Users from '../../databases/models/users';
import Forks from '../../databases/models/forks';
import checkParams from "../../middlewares/CheckParams";
import checkBody from "../../middlewares/CheckBody";

const router = express.Router();

router.get('/:id', checkParams, async (req, res) => {
    const {id} = req.params;

    try {
        const goal = await Goals.findOne({_id: id});

        logger.info(`${id} 원본 목표에 초대된 유저를 가져옵니다.`);
        res.status(200).send({success: true, code: 0, data: goal!.members});
    } catch (e) {
        logger.error(`${id} 원본 목표에 초대된 유저를 가져오는 중 오류가 발생하였습니다. \n${e}`);
        res.sendStatus(500);
    }
});

router.put('/:id', checkParams, checkBody, async (req, res) => {
    const {id} = req.params;
    const {email} = req.body;

    try {
        const userData = await Users.findOne({email});
        const goal = await Goals.findOne({_id: id});
        const forkGoal = await Forks.findOne({ originId: id });
        const prevMembers = goal!.members;
        const prevGoals = userData!.goal;

        if (prevMembers.includes(userData!)) {
            res.status(200).send({success: false, code: 402});
            return;
        }

        prevMembers.push(userData!);
        prevGoals.push(forkGoal!);

        await Goals.updateOne({_id: id}, {members: prevMembers});
        await Users.updateOne({email}, {goal: prevGoals});

        logger.info(`${id} 원본 목표에 ${email} 유저를 초대합니다.`);
        res.status(200).send({success: true, code: 0});
    } catch (e) {
        logger.error(`${id} 원본 목표에 ${email} 유저를 초대하는 중 오류가 발생하였습니다. \n${e}`);
        res.sendStatus(500);
    }
});

router.delete('/:id', checkParams, checkBody, async (req, res) => {
    const {id} = req.params;
    const {email} = req.body;

    try {
        const userData = await Users.findOne({email});
        const goal = await Goals.findOne({_id: id});
        const forkGoal = await Forks.findOne({ originId: id });
        const prevMembers = goal!.members;
        const prevGoals = userData!.goal;

        const deleteIndex = prevMembers.findIndex((user) => user === userData);
        if (deleteIndex > -1) prevMembers.splice(deleteIndex, 1);

        const deleteIndex2 = prevGoals.findIndex((g) => g === forkGoal);
        if (deleteIndex2 > -1) prevGoals.splice(deleteIndex2, 1);

        await Goals.updateOne({_id: id}, {members: prevMembers});
        await Users.updateOne({email}, {goal: prevGoals});

        logger.info(`${id} 원본 목표에 ${email} 유저를 초대 해제합니다.`);
        res.status(200).send({success: true, code: 0});
    } catch (e) {
        logger.error(`${id} 원본 목표에 ${email} 유저를 초대 해제하는 중 오류가 발생하였습니다. \n${e}`);
        res.sendStatus(500);
    }
});


export default router;