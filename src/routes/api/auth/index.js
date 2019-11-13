import express from 'express';
import localRoutes from './LocalRoutes';
import githubRoutes from './GithubRoutes';

const router = express.Router();

router.use('/local', localRoutes);
router.use('/github', githubRoutes);

export default router;
