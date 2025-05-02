import express from 'express';
import {
  getProfile,
  updateProfile,
  getUserProfile,
  getUsersForAdmin,
} from '../controllers/userController.js';
import { protect, restrictTo } from '../middlewares/auth.js';
import User from '../models/User.js';

const router = express.Router();

router.use(protect);

router.route('/me')
  .get(getProfile)
  .patch(updateProfile)
router.route('/:id')
  .get(getUserProfile);


router.get('/admin/getUsers', protect, restrictTo('admin'), getUsersForAdmin);


router.get('/years/getYears', protect, async (req, res) => {
  try {
      const years = await User.distinct('universityId', {
          universityId: { $exists: true, $ne: null }
      }).then(ids => 
          ids.map(id => id.substring(0, 2)).filter((v, i, a) => a.indexOf(v) === i)
          .sort((a, b) => b.localeCompare(a)));
      
      res.status(200).json({
          success: true,
          data: years
      });
  } catch (err) {
      res.status(500).json({
          success: false,
          message: 'Error fetching years'
      });
  }
});

export { router as userRoutes };