import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBell, FaEnvelope, FaUserCircle } from 'react-icons/fa';
// import { UserContext } from '../../contexts/UserContext';
import { useUser } from '../../contexts/UserContext';
import './header.css';

const Header = () => {
  const { user } = useUser();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch notifications when component mounts
    const fetchNotifications = async () => {
      try {
        // Replace with your actual API call
        // const { data } = await axios.get('/api/notifications');
        // setNotifications(data);
        setNotifications([
          { id: 1, text: 'لديك رسالة جديدة', read: false, link: '/messages' },
          { id: 2, text: 'تمت الموافقة على طلبك', read: true, link: '/profile' }
        ]);
      } catch (error) {
        console.error('Failed to fetch notifications', error);
      }
    };

    if (user) {
      fetchNotifications();
    }
  }, [user]);
  
  if (!user) return null;

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left">
        </div>
        
        <div className="header-right">
          <div className="header-icon" onClick={() => navigate('/messages')}>
            <FaEnvelope />
            {/* {unreadMessagesCount > 0 && (
              <span className="notification-badge">{unreadMessagesCount}</span>
            )} */}
          </div>
          
          <div 
            className="header-icon notification-icon" 
            onClick={() => setNotificationsOpen(!notificationsOpen)}
          >
            <FaBell />
            {/* {unreadNotificationsCount > 0 && (
              <span className="notification-badge">{unreadNotificationsCount}</span>
            )} */}
            
            {/* {notificationsOpen && (
              <div className="notifications-dropdown">
                <h4>الإشعارات</h4>
                {notifications.length === 0 ? (
                  <p className="empty-notifications">لا توجد إشعارات</p>
                ) : (
                  notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`notification-item ${notification.read ? '' : 'unread'}`}
                      onClick={() => navigate(notification.link)}
                    >
                      {notification.text}
                    </div>
                  ))
                )}
              </div>
            )} */}
          </div>
          
          <Link to="/ProfilePage" className="profile-link">
            {user.profilePic ? (
              <img src={user.profilePic} alt="Profile" className="profile-pic" />
            ) : (
              <FaUserCircle size={24} />
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;