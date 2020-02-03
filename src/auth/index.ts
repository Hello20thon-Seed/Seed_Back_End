import passport from 'passport';
import { logger } from '../index';
import { GoogleOAuth, NaverOAuth } from './services';
import Users from '../databases/models/users';

export default () => {
	passport.serializeUser((user, done) => {
		done(null, user);
	});

	passport.deserializeUser((user, done) => {
		done(null, user);
	});

	GoogleOAuth();
	NaverOAuth();
};

export const onSuccess = (
	email: string,
	nickname: string,
	profile: string,
	done: (error: any, user?: any) => void
) => {
	Users.findOne({ email })
		.then((data: any) => {
			if (!data) {
				const obj = {
					email,
					nickname,
					profile
				};

				Users.create(obj)
					.then((data: any) => {
						logger.info(`${data!.email} 님이 새로 가입하였습니다.`);
						done(null, data);
					})
					.catch((err: Error) => {
						logger.error('회원가입 중 오류가 발생하였습니다.');
						logger.error(err);
					});

				return;
			}

			logger.info(`${data!.email} 님이 로그인 하였습니다.`);
			done(null, data);
		})
		.catch((err: Error) => {
			logger.error('로그인 중 오류가 발생하였습니다.');
			logger.error(err);
		});
};