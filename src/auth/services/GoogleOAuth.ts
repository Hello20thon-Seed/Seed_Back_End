import passport from 'passport';
import google from 'passport-google-oauth20';
import config from '../../config';
import { logger } from '../../index';
import { onSuccess } from '../index';

const Strategy = google.Strategy;

export const GoogleOAuth = () => {
	passport.use(
		new Strategy(
			{
				clientID: config.oauth.google.clientId,
				clientSecret: config.oauth.google.clientSecret,
				callbackURL: 'https://seed-api.run.goorm.io/auth/google/callback'
			},
			(accessToken, refreshToken, profile, done) => {
				const email = profile.emails![0].value;
				const nickname = profile.displayName;
				const profileUrl = profile.photos![0].value;
				
				onSuccess(email, nickname, profileUrl, done);				
			}
		)
	);
};