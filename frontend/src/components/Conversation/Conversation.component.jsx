import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { FaPaperPlane, FaUserCircle } from 'react-icons/fa';
import axios from 'axios';
import './Conversation.css';

const Conversation = () => {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [recipient, setRecipient] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: messages }, { data: user }] = await Promise.all([
          axios.get(`/api/messages/${userId}`),
          axios.get(`/api/users/${userId}`)
        ]);
        setMessages(messages);
        setRecipient(user);
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
      const { data } = await axios.post('/api/messages', {
        recipient: userId,
        content: newMessage
      });
      
      setMessages([...messages, data]);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message', error);
    }
  };

  if (!recipient) return <div>Loading...</div>;

  return (
    <div className="conversation-container">
      <div className="conversation-header">
        {recipient.profilePic ? (
          <img src={recipient.profilePic} alt={recipient.name} />
        ) : (
          <FaUserCircle size={40} />
        )}
        <h3>{recipient.name}</h3>
      </div>

      <div className="messages-container">
        {messages.map(message => (
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
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="اكتب رسالة..."
        />
        <button type="submit">
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
};

export default Conversation;