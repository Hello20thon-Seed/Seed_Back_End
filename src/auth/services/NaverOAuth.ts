import passport from 'passport';
import naver from 'passport-naver';
import config from '../../config';
import { logger } from '../../index';
import { onSuccess } from '../index';

const Strategy = naver.Strategy;

export const NaverOAuth = () => {
    passport.use(
        new Strategy(
            {
                clientID: config.oauth.naver.clientId,
                clientSecret: config.oauth.naver.clientSecret,
                callbackURL: 'https://seed-api.run.goorm.io/auth/naver/callback'
            },
            (accessToken, refreshToken, profile, done) => {
				const email = profile.emails![0].value;
				const nickname = profile.displayName;
				const profileUrl = profile._json.profile_image;
				
				onSuccess(email, nickname, profileUrl, done);
            }
        )
    );
};