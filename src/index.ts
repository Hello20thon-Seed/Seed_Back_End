import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import log4js from 'log4js';
import logconfig from './log4js.json';
import cors from 'cors';
import passport from 'passport';
import auth from './auth';
import cookieParser from 'cookie-parser';
import AuthRouter from './routers/AuthRouter';
import GoalRouter from './routers/GoalRouter';
import GoalGetterRouter from './routers/GoalGetterRouter';
import ForkRouter from './routers/ForkRouter';
import MemberRouter from './routers/MemberRouter';
import databases from './databases';

export const app = express();
export const logger = log4js.getLogger();

dotenv.config();
log4js.configure(logconfig);

logger.level = 'ALL';

databases();

app.set('trust proxy', true);
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
    session({
        secret: process.env.SESSION_SECRET || '1!2@3#4$5%6^',
        resave: true,
        saveUninitialized: false
    })
);
app.use(passport.initialize());
app.use(passport.session());

auth();

app.use((req, res, next) => {
    const { method, originalUrl } = req;
    const ua = req.get('User-Agent');
    logger.info(`${method} ${originalUrl} - ${ua}`);
    next();
});

app.use('/auth', AuthRouter);
app.use('/goal', GoalRouter);
app.use('/goal', GoalGetterRouter);
app.use('/fork', ForkRouter);
app.use('/member', MemberRouter);

const port = process.env.PORT || 8080;
app.listen(port, () => logger.info(`backend server listening on ${port}`));
