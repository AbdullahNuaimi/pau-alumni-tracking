import User from '../models/User.js';
import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

// Create post with Arabic content validation
export const createPost = async (req, res, next) => {
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
      message: req.user.role === 'admin' 
        ? 'تم نشر المنشور بنجاح' 
        : 'تم إرسال المنشور للمراجعة',
      data: post
    });

  } catch (err) {
    next(err);
  }
};

// @desc    Get all posts (with filtering)
// @route   GET /api/v1/posts
// @access  Public (Pending posts hidden for non-admins)
export const getAllPosts = async (req, res, next) => {
  try {
    // For admins: show all posts
    // For users: show only approved posts + their own pending posts
    const filter = req.user?.role === 'admin' 
      ? {} 
      : {
          $or: [
            { status: 'approved' },
            { author: req.user?.id, status: 'pending' }
          ]
        };

    // Filter by type if provided (e.g., /posts?type=job)
    if (req.query.type) {
      filter.type = req.query.type;
    }

    const posts = await Post.find(filter)
      .populate('author', 'name profilePic universityId')
      .populate('comments')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts
    });

  } catch (err) {
    next(err);
  }
};

// @desc    Get single post
// @route   GET /api/v1/posts/:id
// @access  Public (Pending posts visible only to author/admin)
export const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name profilePic major graduationYear')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'name profilePic' }
      });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'المنشور غير موجود'
      });
    }

    // Check post visibility
    if (post.status !== 'approved' && 
        (!req.user || (post.author._id.toString() !== req.user.id && req.user.role !== 'admin'))) {
      return res.status(403).json({
        success: false,
        message: 'غير مصرح لك بمشاهدة هذا المنشور'
      });
    }

    res.status(200).json({
      success: true,
      data: post
    });

  } catch (err) {
    next(err);
  }
};

// @desc    Update post
// @route   PATCH /api/v1/posts/:id
// @access  Private (Author or Admin)
export const updatePost = async (req, res, next) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'المنشور غير موجود'
      });
    }

    // Check ownership (admin can edit any post)
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'غير مصرح لك بتعديل هذا المنشور'
      });
    }

    // Prevent changing post type if it's an announcement (admin-only)
    if (post.type === 'announcement' && req.body.type && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'لا يمكن تغيير نوع الإعلان إلا بواسطة المسؤول'
      });
    }

    // Update post
    post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('author', 'name profilePic');

    // Reset status if content was edited (requires re-approval)
    if ('content' in req.body && post.status === 'approved' && req.user.role !== 'admin') {
      post.status = 'pending';
      await post.save();
    }

    res.status(200).json({
      success: true,
      message: 'تم تحديث المنشور بنجاح',
      data: post
    });

  } catch (err) {
    next(err);
  }
};

// @desc    Delete post
// @route   DELETE /api/v1/posts/:id
// @access  Private (Author or Admin)
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'المنشور غير موجود'
      });
    }

    // Check permissions
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'غير مصرح لك بحذف هذا المنشور'
      });
    }

    // Delete associated comments
    await Comment.deleteMany({ post: post._id });

    await post.remove();

    res.status(200).json({
      success: true,
      message: 'تم حذف المنشور بنجاح',
      data: {}
    });

  } catch (err) {
    next(err);
  }
};

// @desc    Approve/reject post (Admin only)
// @route   PATCH /api/v1/posts/:id/approve
// @access  Private (Admin)
export const approvePost = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'الحالة يجب أن تكون "approved" أو "rejected"'
      });
    }

    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('author', 'name email');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'المنشور غير موجود'
      });
    }

    // TODO: Send notification email to author
    res.status(200).json({
      success: true,
      message: `تم ${status === 'approved' ? 'اعتماد' : 'رفض'} المنشور بنجاح`,
      data: post
    });

  } catch (err) {
    next(err);
  }
};