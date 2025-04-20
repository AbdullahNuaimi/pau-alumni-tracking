import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import e from 'express';


const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};


// Register 
export const register = async (req, res, next) => {
  try {
    const { name, email, password, universityId } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await  bcrypt.hash(password, salt);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
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

    if (!user || !(await bcrypt.compare(password, user.password))) {
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

// Logout 
export const logout = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'تم تسجيل الخروج بنجاح'
  });
};

export const updateEducation = async (req, res) => {
  try {
    const { id, education } = req.body;
    
    if (!id || !education) {
      return res.status(400).json({
        success: false,
        message: 'المعرف ومعلومات التعليم مطلوبة'
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: { education: education } },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'لم يتم العثور على المستخدم'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'تم تحديث البيانات التعليمية بنجاح',
      data: updatedUser
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء تحديث البيانات'
    });
  }
};

export const updateUserInfo = async (req, res) => {
  try {
    const { id, name, email, phone, socialMedia } = req.body;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'معرف المستخدم مطلوب'
      });
    }

    const updateData = {
      name,
      email,
      phone,
      socialMedia
    };

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true,
        runValidators: true 
      }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'لم يتم العثور على المستخدم'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'تم تحديث البيانات بنجاح',
      data: updatedUser
    });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'البريد الإلكتروني مسجل مسبقاً'
      });
    }
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء تحديث البيانات'
    });
  }
};


export const updateProfileImage = async (req, res) => {
  try {
    const { id, profilePic } = req.body;
    
    if (!id || !profilePic) {
      return res.status(400).json({
        success: false,
        message: 'معرف المستخدم وصورة البروفايل مطلوبان'
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { profilePic },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'لم يتم العثور على المستخدم'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'تم تحديث صورة البروفايل بنجاح',
      data: updatedUser
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء تحديث صورة البروفايل'
    });
  }
};