import express from 'express';
import {
  createPost,
  getAllPosts,
  getPost,
  updatePost,
  deletePost,
  approvePost,
  likePost
} from '../controllers/postController.js';
import { protect, restrictTo } from '../middlewares/auth.js';
import multer from 'multer';

const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });


router.route('/')
  .get(getAllPosts)
  .post(protect, upload.single('image'), createPost);
router.route('/:id')
  .get(getPost)
  .patch(protect, updatePost)
  .delete(protect, deletePost);

router.patch('/:id/approve', protect, restrictTo, approvePost);
router.patch('/:id/like', protect, likePost);

export { router as postRoutes };