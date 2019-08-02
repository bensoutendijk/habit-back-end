import express from 'express';
import authRoutes from './auth';
import counterRoutes from './counter';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/counter', counterRoutes);

export default router;
