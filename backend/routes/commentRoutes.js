import express from 'express';
import {
  addComment,
  getComments,
} from '../controllers/commentController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.route('/:postId/comments')
  .get(getComments)
  .post(protect, addComment);


export { router as commentRoutes };