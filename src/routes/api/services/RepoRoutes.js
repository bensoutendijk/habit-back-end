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

        return res.status(200).json(repos.map(repo => ({
            id: repo.id,
            data: repo,
            service,
        })));
    }
    default:
        return res.status(400).json({ service: 'invalid provider' });
    }
});

router.get('/:reponame/details', auth.required, async (req, res) => {
    const { params: { reponame } } = req;
    const { query } = req;
    const { service } = req;
    let search = '';
    if (query.ref) {
        search = `?ref=${query.ref}`;
    }

    const getContents = async (path = '') => {
        const URI = `https://api.github.com/repos/${service.user.username}/${reponame}/contents/${path}${search}`;

        const { data: contents } = await axios.get(URI, {
            headers: { Authorization: `bearer ${service.tokens.accessToken}` },
        });

        const finalContents = await Promise.all(contents.map(async (item) => {
            const finalItem = item;
            if (item.type === 'dir') {
                finalItem.contents = await getContents(encodeURI(item.path));
            }

            return finalItem;
        }));

        return finalContents;
    };

    const getBranches = async () => {
        const URI = `https://api.github.com/repos/${service.user.username}/${reponame}/branches`;

        const { data } = await axios.get(URI, {
            headers: { Authorization: `bearer ${service.tokens.accessToken}` },
        });

        return data;
    };

    switch (service.provider) {
    case 'github': {
        try {
            const data = {};
            data.contents = await getContents();
            data.branches = await getBranches();
            return res.status(200).json(data);
        } catch (error) {
            return res.status(400).json({ contents: error.message });
        }
    }
    default:
        return res.status(400).json({ service: 'invalid provider' });
    }
});

export default router;
