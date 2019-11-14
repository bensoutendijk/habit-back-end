import express from 'express';
import axios from 'axios';
import auth from '../../auth';

const router = express.Router();

router.get('/', auth.required, async (req, res) => {
    const { service } = req;

    let { query: { to: dateTo, from: dateFrom } } = req;

    if (!dateTo) {
        dateTo = new Date().toISOString();
    }

    if (!dateFrom) {
        dateFrom = new Date(1970, 1, 1).toISOString();
    }

    switch (service.provider) {
    case 'github': {
        const reposURI = 'https://api.github.com/user/repos';

        let { data: repos } = await axios.get(reposURI, {
            headers: { Authorization: `bearer ${service.tokens.accessToken}` },
        });

        repos = repos.map(repo => ({
            ...repo,
            _id: repo.time,
        }));

        return res.send(repos);
    }
    default:
        return res.status(400).send({ service: 'unable to get streams' });
    }
});

export default router;
