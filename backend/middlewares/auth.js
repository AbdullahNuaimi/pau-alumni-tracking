import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'غير مصرح بالدخول، يرجى تسجيل الدخول'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: 'انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى'
    });
  }
};

// Admin-only middleware
export const restrictToAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'غير مصرح لك بهذا الإجراء'
    });
  }
  next();
};