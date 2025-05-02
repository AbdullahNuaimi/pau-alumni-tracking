import Notification from '../models/Notification.js';
import User from '../models/User.js';

// @desc    Create a notification
// @route   POST /api/v1/notifications
export const createNotification = async (req, res) => {
  try {
    const { content, link, targetType, targetValue } = req.body;
    const sender = req.user._id;

    let recipients = [];
    
    if (targetType === 'all') {
      recipients = await User.find({}, '_id');
    } else if (targetType === 'college') {
      recipients = await User.find({ 'education.college': targetValue }, '_id');
    } else if (targetType === 'employment') {
      const isEmployed = targetValue === 'employed';
      recipients = await User.find({
        career: isEmployed ? { $exists: true, $ne: [] } : { $exists: true, $size: 0 }
      }, '_id');
    }

    const notification = await Notification.create({
      content,
      link,
      sender,
      recipients: recipients.map(user => user._id),
      targetType,
      targetValue
    });

    res.status(201).json({
      success: true,
      data: notification
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get user notifications
// @route   GET /api/v1/notifications
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipients: req.user._id
    })
    .sort('-createdAt')
    .populate('sender', 'name profilePic');

    res.status(200).json({
      success: true,
      data: notifications
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get admin notifications (sent by admin)
// @route   GET /api/v1/notifications/admin
export const getAdminNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      sender: req.user._id
    })
    .sort('-createdAt');

    res.status(200).json({
      success: true,
      data: notifications
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/v1/notifications/:id/read
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Check if user is recipient
    if (!notification.recipients.includes(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to mark this notification as read'
      });
    }

    // Check if already read
    const alreadyRead = notification.readBy.some(read => read.user.equals(req.user._id));
    if (!alreadyRead) {
      notification.readBy.push({ user: req.user._id });
      await notification.save();
    }

    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};