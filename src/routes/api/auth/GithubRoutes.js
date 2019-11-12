import mongoose from 'mongoose';
import passport from 'passport';
import express from 'express';
import auth from '../../auth';

const router = express.Router();
const LocalUser = mongoose.model('LocalUser');
const OAuthUser = mongoose.model('OAuthUser');

const createGithubUser = async (githubProfile, localUser) => {
    const finalGithubUser = new OAuthUser({
        user: {
            username: githubProfile.username,
            userid: githubProfile.id,
            email: githubProfile.email,
        },
        tokens: {
            accessToken: githubProfile.tokens.accessToken,
            refreshToken: githubProfile.tokens.refreshToken,
            expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 365,
        },
        provider: githubProfile.provider,
    });

    localUser.services.push(finalGithubUser._id);

    try {
        await finalGithubUser.save();
        await localUser.save();
    } catch (err) {
        console.log(err);
    }
};

const updateGithubUser = async (githubProfile, githubUser) => {
    Object.assign(githubUser, githubProfile);

    try {
        await githubUser.save();
    } catch (err) {
        console.log(err);
    }
};

router.get('/login', auth.required, passport.authenticate('github', {
    scope: [
        'user:email',
        'read:user',
        'write:repo_hook',
    ],
}));

router.get('/callback', auth.required, passport.authenticate('github', { failureRedirect: '/login' }), async (req, res) => {
    const { user: githubProfile } = req;
    const { localAuth } = req;

    const localUser = await LocalUser.findById(localAuth._id);
    const githubUser = await OAuthUser.findOne({ 'user.userid': githubProfile.id });

    if (githubUser) {
        updateGithubUser(githubProfile, githubUser);
    } else {
        createGithubUser(githubProfile, localUser);
    }

    return res.redirect('/');
});

export default router;
