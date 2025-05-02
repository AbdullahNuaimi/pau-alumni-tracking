import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaBell } from 'react-icons/fa';
import { useUser } from '../../contexts/UserContext';
import '../Header/header.css';

const Notification = () => {
  const { user } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('/api/v1/notifications', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setNotifications(response.data.data);
        setUnreadCount(response.data.data.filter(n => !n.readBy.some(r => r.user === user._id)).length);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        toast.error('فشل تحميل الإشعارات');
      }
    };

    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`/api/v1/notifications/${notificationId}/read`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNotifications(prev => prev.map(n => 
        n._id === notificationId ? { ...n, readBy: [...n.readBy, { user: user._id }] } : n
      ));
      setUnreadCount(prev => prev - 1);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await Promise.all(
        notifications
          .filter(n => !n.readBy.some(r => r.user === user._id))
          .map(n => 
            axios.put(`/api/v1/notifications/${n._id}/read`, {}, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
          )
      );
      setNotifications(prev => prev.map(n => ({
        ...n,
        readBy: n.readBy.some(r => r.user === user._id) 
          ? n.readBy 
          : [...n.readBy, { user: user._id }]
      })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  return (
    <div className="notification-container">
      <div 
        className="header-icon" 
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <FaBell />
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount}
          </span>
        )}
      </div>

      {showDropdown && (
        <div className="notifications-dropdown">
          <div className="notification-header">
            <h4>الإشعارات</h4>
            {unreadCount > 0 && (
              <button 
                className="notification-mark-all"
                onClick={markAllAsRead}
              >
                تعليم الكل كمقروء
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="empty-notifications">لا توجد إشعارات</div>
          ) : (
            notifications.map(notification => (
              <div
                key={notification._id}
                className={`notification-item ${
                  !notification.readBy.some(r => r.user === user._id) ? 'unread' : ''
                }`}
                onClick={() => {
                  if (!notification.readBy.some(r => r.user === user._id)) {
                    markAsRead(notification._id);
                  }
                  if (notification.link) {
                    window.location.href = notification.link;
                  }
                  setShowDropdown(false);
                }}
              >
                <div className="notification-content">
                  <div className="notification-text">
                    {notification.content}
                  </div>
                  <div className="notification-time">
                    {new Date(notification.createdAt).toLocaleString('ar-EG')}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Notification;