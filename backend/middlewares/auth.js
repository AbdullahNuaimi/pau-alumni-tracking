import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AppError from '../utils/appError.js';

// Protect routes - JWT verification
export const protect = async (req, res, next) => {
  try {
    // 1) Get token from headers
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(
        new AppError('الرجاء تسجيل الدخول للوصول إلى هذه الصفحة', 401)
      );
    }

    // 2) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError('المستخدم المرتبط بهذا الرمز لم يعد موجوداً', 401)
      );
    }

    // 4) Grant access
    req.user = currentUser;
    next();
  } catch (err) {
    next(err);
  }
};

// Restrict to specific roles (Admin)
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('ليس لديك صلاحية للقيام بهذا الإجراء', 403)
      );
    }
    next();
  };
};

// Check ownership (for user-specific resources)
export const checkOwnership = (model) => {
  return async (req, res, next) => {
    try {
      const doc = await model.findById(req.params.id);

      if (!doc) {
        return next(new AppError('المستند غير موجود', 404));
      }

      if (doc.author.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
          new AppError('غير مصرح لك بالتعديل على هذا المستند', 403)
        );
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};