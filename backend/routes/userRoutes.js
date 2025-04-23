import express from 'express';
import {
  getProfile,
  updateProfile,
  getUserProfile,
} from '../controllers/userController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.use(protect);

router.route('/me')
  .get(getProfile)
  .patch(updateProfile)
router.route('/:id')
  .get(getUserProfile);

export { router as userRoutes };