import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true
  },
  link: {
    type: String,
    trim: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  targetType: {
    type: String,
    enum: ['all', 'college', 'employment'],
    required: true
  },
  targetValue: String, // college name or employment status
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);