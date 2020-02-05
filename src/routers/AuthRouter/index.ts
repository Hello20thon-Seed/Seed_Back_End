import express from 'express';
import passport from 'passport';
import {logger} from '../../index';

const router = express.Router();

const frotendDomain = process.env.DOMAIN || 'https://seedd.run.goorm.io/hello2020/frontend_git/Seed_Front_End';

router.get('/google', passport.authenticate('google', {scope: ['email', 'profile']}));
router.get(
    '/google/callback',
    passport.authenticate('google', {
        successRedirect: frotendDomain,
        failureRedirect: frotendDomain
    })
);

router.get('/naver', passport.authenticate('naver'));
router.get(
    '/naver/callback',
    passport.authenticate('naver', {
        successRedirect: frotendDomain,
        failureRedirect: frotendDomain
    })
);

router.get('/logout', (req, res) => {
    const user: any = req.user!;
    if (user !== undefined) {
        logger.info(`${user.email} 님이 로그아웃 하였습니다.`);
        req.logout();
        res.redirect(frotendDomain);
    } else {
        res.sendStatus(401);
    }
});

router.get('/profile', (req, res) => {
    if (req.isAuthenticated()) {
        const user: any = req.user!;
        logger.info(`${user.email} 님의 정보를 불러옵니다.`);
        res.status(200).send({success: true, code: 0, data: user});
    } else {
        res.sendStatus(401);
    }
});

export default router;