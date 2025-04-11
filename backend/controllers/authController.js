import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Helper: Generate JWT token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// Register new user (Arabic responses)
export const register = async (req, res, next) => {
  try {
    const { name, email, password, universityId } = req.body;

    // Validate Arabic name
    if (!/^[\u0600-\u06FF\s]+$/.test(name)) {
      return res.status(400).json({
        success: false,
        message: 'الاسم يجب أن يحتوي على أحرف عربية فقط'
      });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      universityId
    });

    const token = signToken(newUser._id);

    res.status(201).json({
      success: true,
      message: 'تم تسجيل الحساب بنجاح',
      token,
      data: {
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        }
      }
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

// Login user
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user || (password !== user.password)) {
      return res.status(401).json({
        success: false,
        message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      });
    }

    const token = signToken(user._id);

    res.status(200).json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      token,
      data: {
        user: user
      }
    });

  } catch (err) {
    next(err);
  }
};

// Logout (token invalidation would be client-side)
export const logout = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'تم تسجيل الخروج بنجاح'
  });
};