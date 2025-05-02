import express from 'express';
import { protect } from '../middlewares/auth.js';
import {
  createNotification,
  getNotifications,
  markAsRead,
  getAdminNotifications
} from '../controllers/notificationController.js';

const router = express.Router();

router.route('/')
  .post(protect, createNotification)
  .get(protect, getNotifications);

router.route('/admin').get(protect, getAdminNotifications);
router.route('/:id/read').put(protect, markAsRead);

export default router;