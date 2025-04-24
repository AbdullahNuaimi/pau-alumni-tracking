import express from 'express';
import { protect, restrictTo } from '../middlewares/auth.js';
import { getMetrics } from '../controllers/metricsController.js';

const router = express.Router();

router.get('/', protect, restrictTo('admin'), getMetrics);

export default router;