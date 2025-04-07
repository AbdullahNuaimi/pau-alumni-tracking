import { useUser } from "../../contexts/UserContext";
import { useState } from 'react';
import Comment from "../Comment/comment.component";
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
        <Comment
          post={post}
          udpatedPost={udpatedPost}
          setUpdatedPost={setUpdatedPost}
          commentText={commentText}
          setCommentText={setCommentText}
          showComments={showComments}
          setShowComments={setShowComments}
          showLike={showLike}
          setShowLike={setShowLike} 
          user={user}
          />
    </div>
  );
};

export default PostCard;