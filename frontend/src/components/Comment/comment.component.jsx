import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './comment.css';

const Comment = ({ post, user, onCommentAdded }) => {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
  
    setIsSubmitting(true);
    
    try {
      const response = await axios.post(
        `/api/v1/posts/${post._id}/comments`, // Ensure this matches your route
        { content: commentText },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      onCommentAdded(response.data.data);
      setCommentText('');
      
    } catch (error) {
      console.error('Error adding comment:', error.response?.data || error);
      toast.error(error.response?.data?.message || 'Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="comment-section">
      <div className="comment-actions">
        <button
          onClick={() => setShowComments(!showComments)}
          className="toggle-comments-btn"
        >
          {showComments ? 'إخفاء التعليقات' : 'عرض التعليقات'} ({post.comments?.length || 0})
        </button>
      </div>

      <form onSubmit={handleSubmit} className="comment-form">
        <img
          src={user.profilePic || '/default-avatar.png'}
          alt="صورة الملف الشخصي"
          className="comment-avatar"
        />
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="اكتب تعليقاً..."
          className="comment-input"
          required
        />
        <button 
          type="submit" 
          className="comment-submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'جاري النشر...' : 'نشر'}
        </button>
      </form>

      {showComments && (
        <div className="comments-list">
          {post.comments?.length > 0 ? (
            post.comments.map(comment => (
              <div key={comment._id} className="comment-item">
                <img
                  src={comment.author?.profilePic || '/default-avatar.png'}
                  alt={comment.author?.name}
                  className="commenter-avatar"
                />
                <div className="comment-content">
                  <div className="comment-header">
                    <span className="commenter-name">{comment.author?.name}</span>
                    <span className="comment-date">
                      {new Date(comment.createdAt).toLocaleDateString('ar-EG')}
                    </span>
                  </div>
                  <p className="comment-text">{comment.content}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="no-comments">لا توجد تعليقات بعد</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Comment;