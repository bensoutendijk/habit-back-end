import express from 'express';
import authRoutes from './auth';
import projectRoutes from './project/projectRoutes';
import articleRoutes from './article/articleRoutes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/articles', articleRoutes);

export default router;
