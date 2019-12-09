import express from 'express';
import mongoose from 'mongoose';
import client from '../../../config/client';
import auth from '../../auth';

const router = express.Router();

const LocalUser = mongoose.model('LocalUser');
const OAuthUser = mongoose.model('OAuthUser');
const Project = mongoose.model('Project');

const generateCookies = localUser => ({
    token: `Token ${localUser.generateHttpOnlyJWT()}`,
    token2: `Token ${localUser.generateJWT()}`,
});

const fetchDetails = async (repo, localUser) => {
    const dataURI = `/api/repos/${repo.data.name}/details`;
    const cookies = generateCookies(localUser);

    const { data: details } = await client.get(dataURI, {
        headers: {
            Cookie: Object.keys(cookies).map(key => `${key}=${cookies[key]}`).join(';'),
        },
    });

    return details;
};

const getContents = async (service, reponame, search, path = '') => {
    const { user: { username } } = service;
    const URI = `https://api.github.com/repos/${username}/${reponame}/contents/${path}${search}`;

    try {
        const { data: contents } = await client.get(URI, {
            headers: { Authorization: `bearer ${service.tokens.accessToken}` },
        });

        const finalContents = await Promise.all(contents.map(async (item) => {
            const finalItem = item;
            if (item.type === 'dir') {
                finalItem.contents = await getContents(
                    service, reponame, search, encodeURI(item.path),
                );
            }

            return finalItem;
        }));

        return finalContents;
    } catch (error) {
        return error;
    }
};

const getBranches = async (service, reponame) => {
    const { user: { username } } = service;
    const URI = `https://api.github.com/repos/${username}/${reponame}/branches`;

    try {
        const { data } = await client.get(URI, {
            headers: { Authorization: `bearer ${service.tokens.accessToken}` },
        });

        return data;
    } catch (error) {
        return error;
    }
};

router.get('/', auth.required, async (req, res) => {
    const { localAuth: { _id } } = req;

    const localUser = await LocalUser.findById(_id);
    const services = await OAuthUser.find({ _id: { $in: localUser.services } });
    const projects = await Project.find({ serviceid: { $in: services.map(service => service._id) } });
    const cookies = generateCookies(localUser);

    try {
        const data = await Promise.all(
            services.map(
                async (service) => {
                    const { data: repos } = await client.get(`/api/services/${service.provider}/${service.user.username}/repos`, {
                        headers: {
                            Cookie: Object.keys(cookies).map(key => `${key}=${cookies[key]}`).join(';'),
                        },
                    });

                    const finalRepos = await Promise.all(
                        repos.map(async (repo) => {
                            if (projects.find(project => project.repoid === repo.id)) {
                                return (
                                    Object.assign(repo, {
                                        details: await fetchDetails(repo, localUser),
                                    })
                                );
                            }
                            return repo;
                        }),
                    );

                    return finalRepos;
                },
            ),
        );

        return res.status(200).json(...data);
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            repos: 'Unable to get repos',
            message: error.message,
        });
    }
});

router.get('/:reponame/details', auth.required, async (req, res) => {
    const { localAuth: { _id } } = req;

    const localUser = await LocalUser.findById(_id);
    const services = await OAuthUser.find({ _id: { $in: localUser.services } });
    const { query, params: { reponame } } = req;

    let search = '?';
    if (query.ref) {
        search += `ref=${query.ref}`;
    }

    services.map(async (service) => {
        switch (service.provider) {
        case 'github': {
            try {
                const data = {};
                data.contents = await getContents(service, reponame, search);
                data.branches = await getBranches(service, reponame);
                return res.status(200).json(data);
            } catch (error) {
                return res.status(400).json({ contents: error.message });
            }
        }
        default:
            return res.status(400).json({ service: 'invalid provider' });
        }
    });
});

export default router;
