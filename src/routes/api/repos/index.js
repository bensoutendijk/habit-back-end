import express from 'express';
import mongoose from 'mongoose';
import client from '../../../config/client';
import auth from '../../auth';

const router = express.Router();

const LocalUser = mongoose.model('LocalUser');
const OAuthUser = mongoose.model('OAuthUser');

router.get('/', auth.required, async (req, res) => {
    const { localAuth: { _id } } = req;

    const localUser = await LocalUser.findById(_id);
    const services = await OAuthUser.find({ _id: { $in: localUser.services } });

    const cookies = {
        token: `Token ${localUser.generateHttpOnlyJWT()}`,
        token2: `Token ${localUser.generateJWT()}`,
    };

    try {
        const data = await Promise.all(
            services.map(
                async (service) => {
                    const { data: repos } = await client.get(`/api/services/${service.provider}/${service.user.username}/repos`, {
                        headers: {
                            Cookie: Object.keys(cookies).map(key => `${key}=${cookies[key]}`).join(';'),
                        },
                    });
                    return repos;
                },
            ),
        );
        console.log(...data);
        return res.status(200).send(...data);
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            repos: 'Unable to get repos',
            message: error.message,
        });
    }
});

export default router;
