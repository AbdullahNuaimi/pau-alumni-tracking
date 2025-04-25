import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

export const addComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const postId = req.params.postId;
    console.log("post ID: " , req.params.postId);
    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'محتوى التعليق مطلوب'
      });
    }

    const comment = await Comment.create({
      content,
      author: req.user.id,
      post: postId
    });

    // Populate author info before returning
    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'name profilePic');

    // Update the post's comments array
    await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: comment._id } },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: 'تم إضافة التعليق بنجاح',
      data: populatedComment
    });

  } catch (err) {
    next(err);
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