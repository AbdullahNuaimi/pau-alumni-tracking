import User from '../models/User.js';

// Get user profile (Arabic formatted response)
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password -__v');

    res.status(200).json({
      success: true,
      data: {
        user: {
          ...user.toObject(),
          joinDate: user.createdAt.toLocaleDateString('ar-EG')
        }
      }
    });

  } catch (err) {
    next(err);
  }
};

// Update profile with validation
export const updateProfile = async (req, res, next) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'universityId'];
    const isValidUpdate = updates.every(update => 
      allowedUpdates.includes(update)
    );

    if (!isValidUpdate) {
      return res.status(400).json({
        success: false,
        message: 'تحديثات غير مسموح بها'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'تم تحديث الملف الشخصي',
      data: user
    });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'البريد الإلكتروني مسجل مسبقاً'
      });
    }
    next(err);
  }
};