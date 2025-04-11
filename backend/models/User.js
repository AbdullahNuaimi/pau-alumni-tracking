import mongoose from 'mongoose';
import { DEFAULT_PROFILE_IMAGE } from '../assets/defaultPfpBase64.js';

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
  profilePic: {
    type: String,
    default: DEFAULT_PROFILE_IMAGE,
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
  education: [{
    degree: { type: String, required: true },
    major: { type: String, required: true },
    university: String,
    year: Number
  }],
  career: [{
    company: String,
    position: String,
    startDate: Date,
    endDate: Date,
    currentlyWorking: Boolean
  }],
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }]
}, { timestamps: true });
userSchema.index({ email: 1, universityId: 1 });

export default mongoose.model('User', userSchema);