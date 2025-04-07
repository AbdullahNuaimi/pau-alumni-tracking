import { useUser } from "../../contexts/UserContext";
import { useState } from 'react';
import './postCard.css';
const PostCard = ({ post, onApprove, onReject }) => {
  const { user } = useUser();
  const showPendingStatus = (post.status === 'pending' &&
    (post.author === user.name || user.isAdmin));
  const postTypeLabels = {
    general: 'عام',
    announcement: 'إعلان',
    job: 'فرصة عمل',
    success: 'قصة نجاح'
  };

  const statusColors = {
    pending: 'orange',
    approved: 'green',
    rejected: 'red'
  };
  const isAdmin = user.isAdmin;
  const isPending = post.status === 'pending';
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [showLike, setShowLike] = useState(post.likes.includes(user.id));
  const [udpatedPost, setUpdatedPost] = useState(post);

  const handleLike = () => {
    const isLiked = post.likes.includes(user.id);
      if(isLiked) {
        post.likes = post.likes.filter(id => id !== user.id);
        setShowLike(false);
      }else {
        post.likes = [...post.likes, user.id];
        setShowLike(true);

      }
    
    // Update post (in real app, call API then update context)
    console.log('Liked post:', post.id);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now(),
      author: user.name,
      authorId: user.id,
      authorImage: user.profilePic,
      content: commentText,
      date: new Date().toLocaleDateString('ar-EG')
    };

    setUpdatedPost({
      ...post,
      comments: [...post.comments, newComment]
    });
    post.comments = [...post.comments, newComment];
    // console.log('New comment:', newComment);
    console.log('comments:', post.comments);
    setCommentText('');
    // API call would go here
  };


  return (
    <div className={`post-card ${post.status} ${post.type}`}
      style={{
        borderLeft: `4px solid ${statusColors[post.status]}`,
        opacity: post.status === 'rejected' ? 0.7 : 1
      }}>
      {showPendingStatus && (
        <div className="pending-badge">
          ⏳ قيد المراجعة (فقط أنت والمسؤولون يمكنهم رؤية هذا)
        </div>
      )}
      {(isAdmin && isPending) && (
        <div className="admin-actions">
          <h4>إجراءات المسؤول:</h4>
          <button
            onClick={() => onApprove(post.id)}
            className="approve-btn"
          >
            ✅ قبول المنشور
          </button>
          <button
            onClick={() => onReject(post.id)}
            className="reject-btn"
          >
            ❌ رفض المنشور
          </button>
        </div>
      )}
      <div className="post-meta">
        <span className="post-type-badge">
          {postTypeLabels[post.type]}
        </span>
        <span className="post-status" style={{
          backgroundColor: statusColors[post.status]
        }}>
          {post.status === 'pending' ? 'قيد المراجعة' :
            post.status === 'approved' ? 'مقبول' : 'مرفوض'}
        </span>
      </div>
      <div className="post-header">
        <img
          src={post.authorImage}
          alt={post.author}
          className="post-author-avatar"
        />
        <div className="post-author-info">
          <h4>{post.author}</h4>
          <span className="post-date">{post.date}</span>
        </div>
      </div>

      <div className="post-content">
        <p>{post.content}</p>
        {post.image && (
          <img
            src={post.image}
            alt="صورة المنشور"
            className="post-image"
          />
        )}
      </div>

      <div className="post-actions">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleLike();
          }}
          className={`like-btn ${post.likes.includes(user.id) ? 'liked' : ''}`}
        >
          {showLike ? '❤️' : '🤍'} إعجاب ({post.likes.length})
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowComments(!showComments);
          }}
          className="comment-btn"
        >
          💬 تعليق ({udpatedPost.comments.length})
        </button>
      </div>
      <form onSubmit={handleCommentSubmit} className="comment-form">
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
          />
          <button type="submit" className="comment-submit-btn">
            نشر
          </button>
        </form>
      {showComments && (
        <div className="comments-section" onClick={e => e.stopPropagation()}>
          <div className="comments-list">
            {udpatedPost.comments.length > 0 ? (
              udpatedPost.comments.map(comment => (
                <div key={comment.id} className="comment">
                  <div className="comment-header">
                    <img
                      src={comment.authorImage || '/default-avatar.png'}
                      alt={comment.author}
                      className="comment-avatar"
                    />
                    <div>
                      <h4>{comment.author}</h4>
                      <p className="comment-content">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-comments">لا توجد تعليقات بعد</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;