import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

export const createPost = async (req, res, next) => {
  try {
    const { content, type, image } = req.body;

    if (!content || !type) {
      return res.status(400).json({
        success: false,
        message: 'المحتوى ونوع المنشور مطلوبان'
      });
    }

    // Validate image if provided
    if (image && !image.startsWith('data:image')) {
      return res.status(400).json({
        success: false,
        message: 'صيغة الصورة غير صالحة'
      });
    }

    const post = await Post.create({
      author: req.user.id,
      content,
      type,
      image, 
      status: req.user.role === 'admin' ? 'approved' : 'pending'
    })

    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { posts: post._id } },
      { new: true }
    );

    const populatedPost = await Post.findById(post._id)
    .populate('author', 'name profilePic universityId')
    .lean();

    res.status(201).json({
      success: true,
      message: req.user.role === 'admin' 
        ? 'تم نشر المنشور بنجاح' 
        : 'تم إرسال المنشور للمراجعة',
      data: populatedPost,
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const yearFilter = req.query.year;
    const searchQuery = req.query.search;

    // Base match for permissions
    let baseMatch = req.headers.role === 'admin' 
      ? {} 
      : {
          $or: [
            { status: 'approved' },
            { author: new mongoose.Types.ObjectId(req.query.userId), status: 'pending' }
          ]
        };

    // Add search filter if provided
    if (searchQuery) {
      baseMatch = {
        ...baseMatch,
        $or: [
          { content: new RegExp(searchQuery, 'i') },
          { 'authorData.name': new RegExp(searchQuery, 'i') }
        ]
      };
    }

    const pipeline = [
      { $match: baseMatch },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'authorData'
        }
      },
      { $unwind: '$authorData' }
    ];

    // Add year filter if provided
    if (yearFilter) {
      pipeline.push({
        $match: {
          'authorData.universityId': new RegExp(`^${yearFilter}`)
        }
      });
    }

    // Add pagination and sorting
    pipeline.push(
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'comments',
          localField: 'comments',
          foreignField: '_id',
          as: 'commentsData'
        }
      },
      {
        $project: {
          content: 1,
          type: 1,
          status: 1,
          image: 1,
          likes: 1,
          comments: 1,
          createdAt: 1,
          updatedAt: 1,
          author: {
            _id: '$authorData._id',
            name: '$authorData.name',
            profilePic: '$authorData.profilePic',
            universityId: '$authorData.universityId'
          },
          comments: {
            $map: {
              input: '$commentsData',
              as: 'comment',
              in: {
                _id: '$$comment._id',
                content: '$$comment.content',
                author: {
                  _id: '$$comment.author._id',
                  name: '$$comment.author.name',
                  profilePic: '$$comment.author.profilePic'
                },
                createdAt: '$$comment.createdAt'
              }
            }
          }
        }
      }
    );
    const posts = await Post.aggregate(pipeline);
    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (err) {
    console.error('Error in getAllPosts:', err);
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

// @desc    Like/unlike post
// @route   PATCH /api/v1/posts/:id/like
// @access  Private
export const likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'المنشور غير موجود'
      });
    }

    const isLiked = post.likes.includes(req.user.id);
    
    if (isLiked) {
      post.likes = post.likes.filter(id => id.toString() !== req.user.id);
    } else {
      post.likes.push(req.user.id);
    }

    await post.save();

    res.status(200).json({
      success: true,
      message: isLiked ? 'تم إزالة الإعجاب' : 'تم تسجيل الإعجاب',
      data: post
    });

  } catch (err) {
    next(err);
  }
};

// @desc    Get full post with comments
// @route   GET /api/v1/posts/:id/full
// @access  Private
export const getFullPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name profilePic universityId')
      .populate({
        path: 'comments',
        populate: { 
          path: 'author', 
          select: 'name profilePic',
          options: { sort: { createdAt: -1 } } 
        }
      });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'المنشور غير موجود'
      });
    }

    if (post.status !== 'approved' && 
        (post.author._id.toString() !== req.user.id && req.user.role !== 'admin')) {
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

// @desc    Get posts by user
// @route   GET /api/v1/posts/comments/user/:userId
// @access  Private
export const getUserComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ author: req.params.userId })
      .populate('post', 'content')
      .sort('-createdAt')
      .lean();

    res.status(200).json({
      success: true,
      data: comments
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get posts liked by user
// @route   GET /api/v1/posts/likes/user/:userId
// @access  Private
export const getUserLikedPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ likes: req.params.userId })
      .sort('-createdAt')
      .lean();

    res.status(200).json({
      success: true,
      data: posts
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get posts liked by user
// @route   GET /api/v1/posts/likes/user/:userId
// @access  Private
export const getUserPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ author: req.params.userId })
      .sort('-createdAt')
      .lean();

    res.status(200).json({
      success: true,
      data: posts
    });
  } catch (err) {
    next(err);
  }
};