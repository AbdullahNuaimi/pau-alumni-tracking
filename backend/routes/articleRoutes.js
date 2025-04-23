import express from 'express';
import {
  createArticle,
  getArticles,
  getArticleById,
  uploadArticleImages
} from '../controllers/articleController.js';
import { protect, restrictTo } from '../middlewares/auth.js';
import { upload } from '../middlewares/multer.js';

const router = express.Router();

router.post(
    '/upload',
    protect,
    restrictTo('admin'),
    (req, res, next) => {
      next();
    },
    upload.array('images', 10),
    uploadArticleImages
  );

router.route('/')
  .get(getArticles)
  .post(protect, restrictTo('admin'), createArticle);

router.get('/:id', getArticleById);

export { router as articleRoutes };