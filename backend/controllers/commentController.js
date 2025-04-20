import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

export const addComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const { postId } = req.params;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required'
      });
    }

    // Create new comment
    const comment = await Comment.create({
      content,
      post: postId,
      author: req.user.id
    });

    // Populate author info
    await comment.populate('author', 'name profilePic');

    // Add comment to post's comments array
    await Post.findByIdAndUpdate(postId, {
      $push: { comments: comment._id }
    });

    res.status(201).json({
      success: true,
      data: comment
    });

  } catch (error) {
    next(error);
  }
};

export const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'name profilePic')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments
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