import { useNavigate, useLocation } from 'react-router-dom';
import { FaEnvelope, FaUserCircle } from 'react-icons/fa';
import { useUser } from '../../contexts/UserContext';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Notification from '../Notification/Notification';
import './header.css';

const Header = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation()

  const refreshUnreadCount = async () => {
    try {
      const response = await axios.get('/api/v1/messages/unread-count/getCount', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Error refreshing unread count:', error);
    }
  };

  useEffect(() => {
    if (!user) return;
    console.log("location: ", location)
    const fetchUnreadMessages = async () => {
      try {
        const response = await axios.get('/api/v1/messages/unread-count/getCount', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.data.success) {
          setUnreadCount(response.data.count);
        } else {
          console.error('Failed to fetch unread count:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching unread messages:', 
          error.response?.data?.message || error.message);
      }
    };

    fetchUnreadMessages();
    const interval = setInterval(fetchUnreadMessages, 30000);
    
    return () => clearInterval(interval);
  }, [user,location]);


  const handleMessageClick = () => {
    refreshUnreadCount(); 
    navigate('/messages');
  };


  if (!user) return null;

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left">
          <div className="header-icon message-icon" onClick={handleMessageClick}>
            <FaEnvelope />
            {unreadCount > 0 && (
              <span className="unread-badge">{unreadCount}</span>
            )}
          </div>
          <Notification />
        </div>
        <div className="header-icon" onClick={() => navigate('/ProfilePage')}>
          {user.profilePic ? (
            <img src={user.profilePic} alt="Profile" className="profile-pic" />
          ) : (
            <FaUserCircle size={24} />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;