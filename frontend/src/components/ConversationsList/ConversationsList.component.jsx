import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaComment } from 'react-icons/fa';
import axios from 'axios';
import './ConversationsList.css';

const ConversationsList = ({ searchQuery }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data } = await axios.get('/api/messages/conversations');
        setConversations(data);
      } catch (error) {
        console.error('Failed to fetch conversations', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const filteredConversations = conversations.filter(conv => 
    conv.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div>Loading conversations...</div>;

  return (
    <div className="conversations-list">
      {filteredConversations.length === 0 ? (
        <div className="no-conversations">
          <FaComment size={48} />
          <p>لا يوجد محادثات</p>
        </div>
      ) : (
        filteredConversations.map(conv => (
          <Link 
            to={`/messages/${conv.user._id}`} 
            key={conv.user._id}
            className="conversation-item"
          >
            <div className="avatar">
              {conv.user.profilePic ? (
                <img src={conv.user.profilePic} alt={conv.user.name} />
              ) : (
                <FaUserCircle size={40} />
              )}
              {conv.unreadCount > 0 && (
                <span className="unread-badge">{conv.unreadCount}</span>
              )}
            </div>
            <div className="conversation-details">
              <h4>{conv.user.name}</h4>
              <p className="last-message">
                {conv.lastMessage.sender === conv.user._id ? '' : 'أنت: '}
                {conv.lastMessage.content.slice(0, 30)}...
              </p>
            </div>
          </Link>
        ))
      )}
    </div>
  );
};

export default ConversationsList;