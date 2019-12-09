import express from 'express';
import authRoutes from './auth';
import servicesRoutes from './services';
import projectsRoutes from './projects';
import repoRoutes from './repos';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/projects', projectsRoutes);
router.use('/services', servicesRoutes);
router.use('/repos', repoRoutes);

export default router;
