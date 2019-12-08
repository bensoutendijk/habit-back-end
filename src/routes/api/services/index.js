import express from 'express';
import mongoose from 'mongoose';
import auth from '../../auth';
import repoRoutes from './RepoRoutes';

const router = express.Router();

const LocalUser = mongoose.model('LocalUser');
const OAuthUser = mongoose.model('OAuthUser');


router.use('/:provider/:username/repos', auth.required, async (req, res, next) => {
    const { localAuth: { _id }, params: { provider, username } } = req;

    const { services } = await LocalUser.findById(_id);
    const users = await OAuthUser.find({ _id: { $in: services } });

    const service = users.filter(user => (
        user.provider.toLowerCase() === provider.toLowerCase()
        && user.user.username.toLowerCase() === username.toLowerCase()
    ))[0];

    if (!service) {
        next();
    }

    req.service = service;
    next();
}, repoRoutes);

router.get('/', auth.required, async (req, res) => {
    const { localAuth: { _id } } = req;

    const { services } = await LocalUser.findById(_id);
    const users = await OAuthUser.find({ _id: { $in: services } });

    const data = users.map(user => ({
        _id: user._id,
        data: user.user,
        provider: user.provider,
    }));

    res.send(data);
});

router.get('/', auth.required, async (req, res) => {
    const { localAuth: { _id } } = req;

    try {
        const localUser = await LocalUser.findById(_id);
        const services = await OAuthUser.find({ _id: { $in: localUser.services } });

        if (!services.length) {
            throw new Error('No Services Found');
        }

        const data = services.map(user => ({
            _id: user._id,
            data: user.user,
            provider: user.provider,
        }));

        return res.status(200).json(data);
    } catch (error) {
        return res.status(400).json({ services: error.message });
    }
});

export default router;
