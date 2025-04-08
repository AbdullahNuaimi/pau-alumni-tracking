import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'الاسم مطلوب'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'البريد الإلكتروني مطلوب'],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'البريد الإلكتروني غير صالح']
  },
  password: {
    type: String,
    required: [true, 'كلمة المرور مطلوبة'],
    minlength: [8, 'يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل']
  },
  role: {
    type: String,
    enum: {
      values: ['user', 'admin'],
      message: 'الدور يجب أن يكون إما user أو admin'
    },
    default: 'user'
  },
  // Arabic-specific fields
  universityId: {
    type: String,
    match: [/^\d{7}$/, 'رقم الجامعة يجب أن يكون 7 أرقام']
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);