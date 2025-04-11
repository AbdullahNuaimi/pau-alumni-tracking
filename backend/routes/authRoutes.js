import express from 'express';
import {
  register,
  login,
  logout,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
// router.post('/forgot-password', forgotPassword);
// router.patch('/reset-password/:token', resetPassword);

export { router as authRoutes };