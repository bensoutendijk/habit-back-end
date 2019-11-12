const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const GitHubStrategy = require('passport-github').Strategy;

const keys = require('../config/keys');

const GITHUB_CLIENT_ID = keys.githubClientId;
const GITHUB_CLIENT_SECRET = keys.githubClientSecret;

const User = mongoose.model('LocalUser');
const OAuthUser = mongoose.model('OAuthUser');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
}, (email, password, done) => {
    User.findOne({ email })
        .then((user) => {
            if (!user || !user.validatePassword(password)) {
                return done(null, false, {
                    errors: {
                        'email or password': 'is invalid',
                    },
                });
            }

            return done(null, user);
        }).catch(done);
}));


passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: 'http://127.0.0.1:3000/auth/github/callback',
}, (accessToken, refreshToken, profile, cb) => {
    OAuthUser.findOrCreate({
        githubId: profile.id,
    }, (err, user) => cb(err, user));
}));
