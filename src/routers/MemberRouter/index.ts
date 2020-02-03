import express from 'express';
import {logger} from '../../index';
import Goals from '../../databases/models/goals';
import Users, {UsersStruct} from '../../databases/models/users';

const router = express.Router();

router.get('/:id', async (req, res) => {
    const {id} = req.params;

    if (id === undefined) {
        res.status(200).send({success: false, code: 101});
        return;
    }

    try {
        const goal= await Goals.findOne({ _id: id });

        logger.info(`${id} 원본 목표에 초대된 유저를 가져옵니다.`);
        res.status(200).send({success: true, code: 0, data: goal!.members});
    } catch (e) {
        logger.error(`${id} 원본 목표에 초대된 유저를 가져오는 중 오류가 발생하였습니다. \n${e}`);
        res.sendStatus(500);
    }
});

router.put('/:id', async (req, res) => {
    const {id} = req.params;
    const {email} = req.body;

    if (id === undefined || email === undefined) {
        res.status(200).send({success: false, code: 101});
        return;
    }

    try {
        const userData = await Users.findOne({ email });
        const goal = await Goals.findOne({ _id: id });
        const prevMembers = goal!.members;

        if(prevMembers.includes(userData!)) {
            res.status(200).send({success: false, code: 402});
            return;
        }

        prevMembers.push(userData!);

        await Goals.updateOne({ _id: id }, { members: prevMembers });

        logger.info(`${id} 원본 목표에 ${email} 유저를 초대합니다.`);
        res.status(200).send({success: true, code: 0});
    } catch (e) {
        logger.error(`${id} 원본 목표에 ${email} 유저를 초대하는 중 오류가 발생하였습니다. \n${e}`);
        res.sendStatus(500);
    }
});

router.delete('/:id', async (req, res) => {
    const {id} = req.params;
    const {email} = req.body;

    if (id === undefined || email === undefined) {
        res.status(200).send({success: false, code: 101});
        return;
    }

    try {
        const userData = await Users.findOne({ email });
        const goal = await Goals.findOne({ _id: id });
        const prevMembers = goal!.members;

        const deleteIndex = prevMembers.findIndex((user) => user === userData);
        if (deleteIndex > -1) prevMembers.splice(deleteIndex, 1);

        await Goals.updateOne({ _id: id }, { members: prevMembers });

        logger.info(`${id} 원본 목표에 ${email} 유저를 초대 해제합니다.`);
        res.status(200).send({success: true, code: 0});
    } catch (e) {
        logger.error(`${id} 원본 목표에 ${email} 유저를 초대 해제하는 중 오류가 발생하였습니다. \n${e}`);
        res.sendStatus(500);
    }
});


export default router;