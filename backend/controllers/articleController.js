import Article from '../models/Article.js';

export const createArticle = async (req, res, next) => {
  try {
    const article = await Article.create({
      ...req.body,
      author: req.user.id
    });

    res.status(201).json({
      success: true,
      data: article
    });
  } catch (err) {
    next(err);
  }
};

export const getArticles = async (req, res, next) => {
  try {
    const query = { status: req.query.status || 'published' };
    
    if (req.query.category) {
      query.categories = req.query.category;
    }

    const articles = await Article.find(query)
      .sort('-publishedAt')
      .populate('author', 'name profilePic');

    res.status(200).json({
      success: true,
      count: articles.length,
      data: articles
    });
  } catch (err) {
    next(err);
  }
};

export const getArticleById = async (req, res, next) => {
  try {
    const article = await Article.findById( req.params.id )
      .populate('author', 'name profilePic');

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'المقال غير موجود'
      });
    }

    res.status(200).json({
      success: true,
      data: article
    });
  } catch (err) {
    next(err);
  }
};

export const uploadArticleImages = async (req, res, next) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No images uploaded',
        });
      }
  
      // Return local file paths (relative to your server)
      const fileUrls = req.files.map(file => ({
        url: `/uploads/articles/${file.filename}`, // Public URL path
        path: file.path, // Full server path (e.g., for deletion later)
      }));
  
      res.status(200).json({
        success: true,
        files: fileUrls,
      });
    } catch (err) {
      next(err);
    }
};