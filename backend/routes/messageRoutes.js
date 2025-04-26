import express from 'express';
import { protect } from '../middlewares/auth.js';
import { 
  sendMessage,
  getConversations,
  getMessages,
  searchMessages
} from '../controllers/messageController.js';

const router = express.Router();

router.post('/', protect, sendMessage);
router.get('/conversations', protect, getConversations);
router.get('/:userId', protect, getMessages);
router.get('/findMessageOrUser/search', protect, searchMessages);

export default router;