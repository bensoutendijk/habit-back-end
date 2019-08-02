import express from 'express';
import localRoutes from './LocalRoutes';

const router = express.Router();

router.use('/local', localRoutes);

export default router;
