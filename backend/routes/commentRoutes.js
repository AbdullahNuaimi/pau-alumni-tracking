import express from 'express';
import {
  addComment,
  updateComment,
  deleteComment
} from '../controllers/commentController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.route('/:postId/comments')
  .post(protect, addComment);

router.route('/:postId/comments/:commentId')
  .patch(protect, updateComment)
  .delete(protect, deleteComment);

export { router as commentRoutes };