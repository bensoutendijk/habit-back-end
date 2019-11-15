import express from 'express';
import axios from 'axios';
import auth from '../../auth';

const router = express.Router();

router.get('/', auth.required, async (req, res) => {
    const { service } = req;

    switch (service.provider) {
    case 'github': {
        const reposURI = 'https://api.github.com/user/repos';

        const { data: repos } = await axios.get(reposURI, {
            headers: { Authorization: `bearer ${service.tokens.accessToken}` },
        });

        return res.send(repos);
    }
    default:
        return res.status(400).send({ service: 'unable to get streams' });
    }
});

export default router;
