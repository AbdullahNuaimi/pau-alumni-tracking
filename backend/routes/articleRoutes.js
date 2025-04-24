import express from 'express';
import {
  createArticle,
  getArticles,
  getArticleById,
  uploadArticleImages,
  getArticlesForAdmin,
  updateArticle,
  deleteArticle
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


router.get(
  '/admin/list',
  protect,
  restrictTo('admin'),
  getArticlesForAdmin
);

router.patch('/:id', protect, restrictTo('admin'), updateArticle);

router.delete('/:id', protect, restrictTo('admin'), deleteArticle);

export { router as articleRoutes };