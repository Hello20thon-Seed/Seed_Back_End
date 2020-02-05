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
                owner: ownerData!
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

router.post('/add', async (req, res) => {
    const {
        originId,
        contents,
        level,
        parent,
        isDone,
        owner
    } = req.body;

    if (originId === undefined || contents === undefined || level === undefined || isDone === undefined || owner === undefined) {
        res.status(200).send({success: false, code: 101, id: null});
        return;
    }

    const levelNumber = parseInt(level);
    if (levelNumber < 0 || levelNumber > 5) {
        res.status(200).send({success: false, code: 203});
        return;
    }

    try {
        const userData = await Users.findOne({email: owner});

        const obj = {
            originId,
            contents,
            level,
            parent,
            isDone,
            userData
        };

        const created = await Forks.create(obj);

        logger.info(`새로운 복제 목표를 추가하였습니다. id: ${created._id}`);
        res.status(200).send({success: true, code: 0, id: created._id});
    } catch (e) {
        logger.error(`복제 목표 추가 중 오류가 발생하였습니다. \n${e}`);
        res.sendStatus(500);
    }
});

router.put('/:id', (req, res) => {
    const {id} = req.params;
    const {contents, level, parent, owner} = req.body;

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
    if (owner !== undefined) obj['owner'] = owner;

    Forks.updateOne({_id: id}, obj)
        .then(() => {
            logger.info(`${id} 복제 목표를 수정하였습니다.`);
            res.status(200).send({success: true, code: 0});
        })
        .catch((err: Error) => {
            logger.error(`${id} 복제 목표 수정 중 오류가 발생하였습니다.\n${err}`);
            res.sendStatus(500);
        });
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

export default router;