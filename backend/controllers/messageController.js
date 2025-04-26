import Message from '../models/Message.js';
import User from '../models/User.js';

// Send a message
export const sendMessage = async (req, res) => {
    
  try {
    const { recipient, content } = req.body;
    
    const message = await Message.create({
      sender: req.user.id,
      recipient,
      content
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Failed to send message' });
  }
};

// Get all conversations for current user
export const getConversations = async (req, res) => {
    console.log("hello from getConversations");
  try {
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: req.user._id },
            { recipient: req.user._id }
          ]
        }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', req.user._id] },
              '$recipient',
              '$sender'
            ]
          },
          lastMessage: { $last: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [
                  { $eq: ['$recipient', req.user._id] },
                  { $eq: ['$read', false] }
                ]},
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      { $sort: { 'lastMessage.createdAt': -1 } }
    ]);

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get conversations' });
  }
};

// Get messages between current user and another user
export const getMessages = async (req, res) => {
    console.log("hello from getMessages");
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, recipient: req.params.userId },
        { sender: req.params.userId, recipient: req.user._id }
      ]
    })
    .sort('createdAt')
    .populate('sender', 'name profilePic');

    // Mark messages as read
    await Message.updateMany(
      { 
        sender: req.params.userId, 
        recipient: req.user._id,
        read: false 
      },
      { $set: { read: true } }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get messages' });
  }
};

// Search messages and users
export const searchMessages = async (req, res) => {
    console.log("hello from searchMessages");
  try {
    const { query } = req.query;
    
    // Search users
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' }},
        { email: { $regex: query, $options: 'i' }}
      ],
      _id: { $ne: req.user._id }
    }).select('name email profilePic');

    // Search messages
    const messages = await Message.find({
      $or: [
        { sender: req.user._id },
        { recipient: req.user._id }
      ],
      content: { $regex: query, $options: 'i' }
    })
    .populate('sender recipient', 'name profilePic');

    res.json({ users, messages });
  } catch (error) {
    res.status(500).json({ message: 'Search failed' });
  }
};