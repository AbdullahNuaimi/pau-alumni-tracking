import express from 'express';
import {
  register,
  login,
  logout,
  updateEducation,
  updateUserInfo,
  updateProfileImage,
  updateCareer,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/updateEducation', updateEducation);
router.put('/updateInfo', updateUserInfo);
router.put('/updateProfileImage', updateProfileImage);
router.put('/updateCareer', updateCareer);
// router.post('/forgot-password', forgotPassword);
// router.patch('/reset-password/:token', resetPassword);

export { router as authRoutes };