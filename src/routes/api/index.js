import express from 'express';
import authRoutes from './auth';
import servicesRoutes from './services';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/services', servicesRoutes);

export default router;
