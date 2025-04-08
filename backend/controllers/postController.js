import Post from '../models/Post.js';

// Create post with Arabic validation
export const createPost = async (req, res) => {
  try {
    const { content, type } = req.body;
    
    if (!content || !type) {
      return res.status(400).json({ 
        success: false,
        message: 'المحتوى ونوع المنشور مطلوبان' 
      });
    }

    const post = await Post.create({
      author: req.user.id,
      content,
      type,
      status: req.user.role === 'admin' ? 'approved' : 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'تم إنشاء المنشور بنجاح',
      data: post
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء إنشاء المنشور',
      error: err.message
    });
  }
};