import express from 'express';
import {
  createPost,
  getAllPosts,
  getPost,
  updatePost,
  deletePost,
  approvePost,
  likePost,
  getFullPost,
  getUserComments, 
  getUserLikedPosts,
  getUserPosts
} from '../controllers/postController.js';
import { protect, restrictTo } from '../middlewares/auth.js';
import User from '../models/User.js';
const router = express.Router();
;


router.route('/')
  .get(getAllPosts)
  .post(protect, createPost);
router.route('/:id')
  .get(getPost)
  .patch(protect, updatePost)
  .delete(protect, deletePost);

router.patch('/:id/approve', protect, restrictTo(["admin"]),approvePost);
router.patch('/:id/like', protect, likePost);
router.get('/:id/full', protect, getFullPost);
router.get('/comments/user/:userId', protect, getUserComments);
router.get('/likes/user/:userId', protect, getUserLikedPosts);
router.get('/getPosts/:userId', protect, getUserPosts);

router.get('/years', protect, async (req, res) => {
  try {
      const years = await User.distinct('universityId', {
          universityId: { $exists: true, $ne: null }
      }).then(ids => 
          ids.map(id => id.substring(0, 2)).filter((v, i, a) => a.indexOf(v) === i)
          .sort((a, b) => b.localeCompare(a))) 
      
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
export { router as postRoutes };