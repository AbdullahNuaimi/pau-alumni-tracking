import Article from '../models/Article.js';

export const createArticle = async (req, res, next) => {
  try {
    const existingArticle = await Article.findOne({ title: req.body.title });
    if (existingArticle) {
      return res.status(400).json({
        success: false,
        message: 'عنوان المقال مستخدم من قبل'
      });
    }

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

export const updateArticle = async (req, res, next) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

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

export const deleteArticle = async (req, res, next) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'المقال غير موجود'
      });
    }

    res.status(200).json({
      success: true,
      message: 'تم حذف المقال بنجاح'
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
  
      const fileUrls = req.files.map(file => ({
        url: `/uploads/articles/${file.filename}`, 
        path: file.path, 
      }));
  
      res.status(200).json({
        success: true,
        files: fileUrls,
      });
    } catch (err) {
      next(err);
    }
};

export const getArticlesForAdmin = async (req, res, next) => {
  try {
    const articles = await Article.find()
      .sort('-createdAt')
      .populate('author', 'name');

    res.status(200).json({
      success: true,
      data: articles
    });
  } catch (err) {
    next(err);
  }
};