import express from 'express';
import { protect } from '../middlewares/auth.js';
import { 
  sendMessage,
  getConversations,
  getMessages,
  searchMessages,
  getUnreadCount
} from '../controllers/messageController.js';

const router = express.Router();

router.post('/', protect, sendMessage);
router.get('/conversations', protect, getConversations);
router.get('/:userId', protect, getMessages);
router.get('/findMessageOrUser/search', protect, searchMessages);
router.get('/unread-count/getCount', protect, getUnreadCount);

export default router;