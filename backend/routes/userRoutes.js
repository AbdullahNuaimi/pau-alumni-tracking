import express from 'express';
import {
  getProfile,
  updateProfile,
  getUserProfile,
  getUsersForAdmin,
} from '../controllers/userController.js';
import { protect, restrictTo } from '../middlewares/auth.js';

const router = express.Router();

router.use(protect);

router.route('/me')
  .get(getProfile)
  .patch(updateProfile)
router.route('/:id')
  .get(getUserProfile);


router.get('/admin/getUsers', protect, restrictTo('admin'), getUsersForAdmin);


export { router as userRoutes };