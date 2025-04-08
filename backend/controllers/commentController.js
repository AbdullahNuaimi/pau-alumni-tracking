import Post from '../models/Post.js';

// Add comment with Arabic validation
export const addComment = async (req, res, next) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'محتوى التعليق مطلوب'
      });
    }

    const post = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $push: {
          comments: {
            author: req.user.id,
            authorName: req.user.name,
            content,
            createdAt: new Date()
          }
        }
      },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: 'تم إضافة التعليق',
      data: post.comments
    });

  } catch (err) {
    next(err);
  }
};

// Delete comment (author or admin)
export const deleteComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);

    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'التعليق غير موجود'
      });
    }

    // Check if user is author or admin
    if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'غير مصرح لك بهذا الإجراء'
      });
    }

    comment.remove();
    await post.save();

    res.status(200).json({
      success: true,
      message: 'تم حذف التعليق'
    });

  } catch (err) {
    next(err);
  }
};
// update comment (author or admin)
export const updateComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);

    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'التعليق غير موجود'
      });
    }

    // Check if user is author or admin
    if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'غير مصرح لك بهذا الإجراء'
      });
    }

    
    comment.content = req.body.content;
    comment.edited = true;
    await post.save();

    res.status(200).json({
      success: true,
      message: 'تم تعديل التعليق'
    });

  } catch (err) {
    next(err);
  }
};