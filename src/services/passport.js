const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const GitHubStrategy = require('passport-github').Strategy;

const keys = require('../config/keys');

const GITHUB_CLIENT_ID = keys.githubClientId;
const GITHUB_CLIENT_SECRET = keys.githubClientSecret;

const LocalUser = mongoose.model('LocalUser');

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((id, done) => {
    LocalUser.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
}, (email, password, done) => {
    LocalUser.findOne({ email })
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
}, async (accessToken, refreshToken, profile, done) => {
    const githubUser = {
        user: {
            username: profile.username,
            userid: profile.id,
        },
        tokens: {
            accessToken,
            refreshToken,
            expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30,
        },
        provider: profile.provider,
    };

    return done(null, githubUser);
}));
