import express from 'express';
import {
  getProfile,
  updateProfile,
} from '../controllers/userController.js';
import { protect} from '../middlewares/auth.js';

const router = express.Router();

router.use(protect);

router.route('/me')
  .get(getProfile)
  .patch(updateProfile)


export { router as userRoutes };