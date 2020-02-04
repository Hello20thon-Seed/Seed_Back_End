import express from 'express';
import {logger} from '../../index';
import Forks, {ForksStruct} from '../../databases/models/forks';
import Goals from '../../databases/models/goals';
import Users, {UsersStruct} from '../../databases/models/users';
import checkBody from "../../middlewares/CheckBody";
import checkParams from "../../middlewares/CheckParams";

const router = express.Router();

const pushForkGoaltoUser = async (forkGoal: ForksStruct, owner: string) => {
    try {
        const ownerData = await Users.findOne({email: owner});
        const prevUserGoal: Array<ForksStruct> = ownerData!.goal;
        prevUserGoal.push(forkGoal);
        await Users.updateOne({email: owner}, {goal: prevUserGoal});
    } catch (e) {
        logger.error(`복제된 목표를 유저 정보에 추가하는 중 오류가 발생하였습니다. \n${e}`);
    }
};

const addMembertoOriginGoal = async (id: string, userData: UsersStruct) => {
    try {
        const goalData = await Goals.findOne({_id: id});
        const prevMembers: Array<UsersStruct> = goalData!.members;
        prevMembers.push(userData);

        await Goals.updateOne({_id: id}, {members: prevMembers});
    } catch (e) {
        logger.error(`원본 목표에 멤버 추가 중 오류가 발생하였습니다. \n${e}`);
    }
};

router.post('/create', checkBody, async (req, res) => {
    const {id, owner} = req.body;

    try {
        const ownerData = await Users.findOne({email: owner});
        const originGoal = await Goals.findOne({_id: id});
        const originChildren = await Goals.find({parent: id});
        const {contents, level} = originGoal!;

        if (level !== 0) {
            res.status(200).send({success: false, code: 205});
            return;
        }

        const createRootData = {
            originId: id,
            contents,
            level,
            parent: null,
            isDone: false,
            owner: ownerData!
        };

        const forkGoal = await Forks.create(createRootData);
        await pushForkGoaltoUser(forkGoal, owner); // 유저 데이터에 포크 정보 넣는건 대주제만 넣음
        await addMembertoOriginGoal(id, ownerData!);

        let prevForkGoalId = forkGoal._id;
        for (const originChild of originChildren) {
            const createChildData = {
                originId: originChild._id,
                contents: originChild.contents,
                level: originChild.level,
                parent: prevForkGoalId,
                isDone: false,
                ownerData: ownerData!
            };

            const childForkGoal = await Forks.create(createChildData);
            await addMembertoOriginGoal(originChild._id, ownerData!);

            prevForkGoalId = childForkGoal._id;
        }


        logger.info(`${owner}를 주인으로 ${id} 원본 목표를 복제하였습니다.`);
        res.status(200).send({success: true, code: 0, id: forkGoal._id});
    } catch (e) {
        logger.error(`${owner}를 주인으로 ${id} 원본 목표를 복제 중 오류가 발생하였습니다. \n${e}`);
        res.sendStatus(500);
    }
});

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

router.delete('/:id', checkParams, async (req, res) => {
    const {id} = req.params;

    try {
        await Forks.deleteOne({_id: id});
        logger.info(`${id} 복제 목표를 삭제하였습니다.`);
        res.status(200).send({success: true, code: 0});
    } catch (e) {
        logger.error(`${id} 복제 목표를 삭제 중 오류가 발생하였습니다. \n${e}`);
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