import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaComment } from 'react-icons/fa';
import axios from 'axios';
import './ConversationsList.css';

const ConversationsList = ({ searchQuery, currentActive }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data } = await axios.get('/api/v1/messages/conversations');
        setConversations(data);
      } catch (error) {
        console.error('Failed to fetch conversations', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const handleConversationClick = (conversationId) => {
    setConversations(prev => prev.map(conv => 
      conv.user._id === conversationId 
        ? { ...conv, unreadCount: 0 }
        : conv
    ))
    navigate(`/messages/${conversationId}`);
  };

  const filteredConversations = conversations.filter(conv => 
    conv.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage?.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="loading-state">
      <div className="loading-spinner"></div>
      <p>جاري تحميل المحادثات...</p>
    </div>
  );

  return (
    <div className="conversations-list">
      {filteredConversations.length === 0 ? (
        <div className="no-conversations">
          <FaComment size={48} />
          <p>لا يوجد محادثات</p>
          {searchQuery && <p>لا توجد نتائج لـ "{searchQuery}"</p>}
        </div>
      ) : (
        filteredConversations.map(conv => (
          <div
            key={conv.user._id}
            className={`conversation-item ${currentActive === conv.user._id ? 'active' : ''}`}
            onClick={() => handleConversationClick(conv.user._id)}
          >
            <div className="conversation-list-avatar">
              {conv.user.profilePic ? (
                <img src={conv.user.profilePic} alt={conv.user.name} />
              ) : (
                <FaUserCircle size={44} color="#94a3b8" />
              )}
              {conv.unreadCount > 0 && (
                <span className="unread-badge">{conv.unreadCount}</span>
              )}
            </div>
            <div className="conversation-details">
              <h4>{conv.user.name}</h4>
              <p className="last-message">
                {conv.lastMessage?.sender === conv.user._id ? '' : 'أنت: '}
                {conv.lastMessage?.content.slice(0, 30) || 'بدء المحادثة...'}
              </p>
              {conv.lastMessage && (
                <p className="last-message-time">
                  {new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ConversationsList;