import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {  FaUserCircle } from 'react-icons/fa';
import { IoSend } from 'react-icons/io5';
import axios from 'axios';
import './Conversation.css';

const Conversation = () => {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [recipient, setRecipient] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: messages }, { data: user }] = await Promise.all([
          axios.get(`/api/v1/messages/${userId}`),
          axios.get(`/api/v1/users/${userId}`)
        ]);
        setMessages(messages);
        setRecipient(user.data.user);
      } catch (error) {
        console.error('Failed to fetch conversation', error);
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const { data } = await axios.post('/api/v1/messages', {
        recipient: userId,
        content: newMessage
      });
      
      setMessages(prev => [...prev, data]);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message', error);
    }
  };

  if (!recipient) return (
    <div className="loading-state">
      <div className="loading-spinner"></div>
      <p>جاري تحميل المحادثة...</p>
    </div>
  );

  return (
    <div className="conversation-container">
      <div className="conversation-header">
        {recipient.profilePic ? (
          <img src={recipient.profilePic} alt={recipient.name} />
        ) : (
          <FaUserCircle size={44} color="#94a3b8" />
        )}
        <div className="header-info">
          <h3>{recipient.name}</h3>
          {isTyping && <div className="typing-indicator">يكتب الآن...</div>}
        </div>
      </div>

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-state">
            <p>لا توجد رسائل بعد</p>
            <p>ابدأ المحادثة بإرسال رسالة</p>
          </div>
        ) : (
          messages.map(message => (
            <div 
              key={message._id} 
              className={`message ${message.sender._id === userId ? 'received' : 'sent'}`}
            >
              <div className="message-content">
                {message.content}
              </div>
              <div className="message-time">
                {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="اكتب رسالة..."
          onFocus={() => setIsTyping(true)}
          onBlur={() => setIsTyping(false)}
        />
        <button type="submit" aria-label="إرسال">
          <IoSend size={18} />
        </button>
      </form>
    </div>
  );
};

export default Conversation;