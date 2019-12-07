import mongoose from 'mongoose';
import passport from 'passport';
import express from 'express';
import auth from '../../auth';

const router = express.Router();
const LocalUser = mongoose.model('LocalUser');
const OAuthUser = mongoose.model('OAuthUser');

const createGithubUser = async (githubProfile, localUser) => {
    const finalGithubUser = new OAuthUser(githubProfile);

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
        'repo',
    ],
}));

router.get('/callback', auth.required, passport.authenticate('github', { failureRedirect: '/api/auth/github/login' }), async (req, res) => {
    const { user: githubProfile } = req;
    const { localAuth } = req;

    const localUser = await LocalUser.findById(localAuth._id);
    const githubUser = await OAuthUser.findOne({ 'user.userid': githubProfile.id });

    if (githubUser) {
        updateGithubUser(githubProfile, githubUser);
    } else {
        createGithubUser(githubProfile, localUser);
    }

    return res.redirect(`/projects/new`);
});

router.get('/current', auth.required, async (req, res) => {
    const { githubUser } = req;
    if (githubUser) {
        return res.send(githubUser.user);
    }
    return res.sendStatus(400);
});


export default router;
