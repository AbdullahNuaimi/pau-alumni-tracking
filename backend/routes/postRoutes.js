import express from 'express';
import {
  createPost,
  getAllPosts,
  getPost,
  updatePost,
  deletePost,
  approvePost,
  likePost,
  getFullPost
} from '../controllers/postController.js';
import { protect, restrictTo } from '../middlewares/auth.js';

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

export { router as postRoutes };