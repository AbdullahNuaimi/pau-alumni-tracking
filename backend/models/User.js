import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^\S+@\S+\.\S+$/,
  },
  phone: {
    type: String,
    match: /^\+?\d{10,15}$/,
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  role: {
    type: String,
    enum: {
      values: ['user','admin', 'superadmin'],
    },
    default: 'user'
  },
  universityId: {
    type: String,
    match:/^\d{7}$/,
    required: true
  },
  education:{
    type: Array,
    default: [],
  },
  career:{
    type: Array,
    default: [],
  },
  posts: {
    type: Array,
    default: [],
  },
}, { timestamps: true });
userSchema.index({ email: 1, universityId: 1 });

export default mongoose.model('User', userSchema);