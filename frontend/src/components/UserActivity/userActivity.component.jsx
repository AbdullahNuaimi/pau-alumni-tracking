// components/UserActivity/userActivity.component.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './userActivity.css';

const UserActivity = ({ user }) => {
  const [activeTab, setActiveTab] = useState('posts');
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  const navigate = useNavigate();
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        if (!user?._id) {
          setError('يجب تسجيل الدخول لعرض النشاط');
          setLoading(false);
          return;
        }

        setLoading(true);
        setError(null);
        let endpoint = '';
        
        switch (activeTab) {
          case 'posts':
            endpoint = `/api/v1/posts?userId=${user._id}`;
            break;
          case 'comments':
            endpoint = `/api/v1/posts/comments/user/${user._id}`;
            break;
          case 'likes':
            endpoint = `/api/v1/posts/likes/user/${user._id}`;
            break;
          default:
            endpoint = `/api/v1/posts?userId=${user._id}`;
        }

        const { data } = await axios.get(endpoint);
        setActivities(data.data || []);
        console.log(data.data)
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError('حدث خطأ أثناء جلب البيانات');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [activeTab, user]);

  if (!user) {
    return (
      <div className="user-activity-section">
        <div className="error-message">يجب تسجيل الدخول لعرض النشاط</div>
      </div>
    );
  }

  const handleNavigate = (index) =>{
    if(activeTab === "comments"){
        const postID =  activities[index].post._id;
        navigate(`../posts/${postID}/full`);
        return;

    }
    navigate(`../posts/${activities[index]._id}/full`);
  }

  return (
    <div className="user-activity-section">
      <h2 className="activity-title">نشاط المستخدم</h2>
      
      <div className="activity-tabs">
        <button 
          className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          المنشورات
        </button>
        <button 
          className={`tab-btn ${activeTab === 'comments' ? 'active' : ''}`}
          onClick={() => setActiveTab('comments')}
        >
          التعليقات
        </button>
        <button 
          className={`tab-btn ${activeTab === 'likes' ? 'active' : ''}`}
          onClick={() => setActiveTab('likes')}
        >
          الإعجابات
        </button>
      </div>

      <div className="activity-content">
        {error ? (
          <div className="error-message">{error}</div>
        ) : loading ? (
          <div className="loading">جاري التحميل...</div>
        ) : activities.length === 0 ? (
          <div className="no-activities">لا يوجد نشاط لعرضه</div>
        ) : (
          <ul className="activity-list">
            {activities.map((activity,index) => (
              <li key={activity._id} className="activity-item" onClick={()=>handleNavigate(index)}>
                {activeTab === 'posts' && (
                  <>
                    <h3>{activity.content?.substring(0, 50)}...</h3>
                    <p className="activity-meta">
                      <span>{new Date(activity.createdAt).toLocaleDateString()}</span>
                      <span>{activity.likes?.length || 0} إعجاب</span>
                      <span>{activity.comments?.length || 0} تعليق</span>
                    </p>
                  </>
                )}
                {activeTab === 'comments' && (
                  <>
                    <h3>{activity.content?.substring(0, 50)}...</h3>
                    <p className="activity-meta">
                      <span>على منشور: {activity.post?.content?.substring(0, 30) || 'منشور محذوف'}...</span>
                      <span>{new Date(activity.createdAt).toLocaleDateString()}</span>
                    </p>
                  </>
                )}
                {activeTab === 'likes' && (
                  <>
                    <h3>أعجبك منشور: {activity.content?.substring(0, 50)}...</h3>
                    <p className="activity-meta">
                      <span>{new Date(activity.createdAt).toLocaleDateString()}</span>
                    </p>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserActivity;