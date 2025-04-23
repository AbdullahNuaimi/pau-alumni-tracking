import { useUser } from "../../contexts/UserContext";
import { useState } from 'react';
import Comment from "../Comment/comment.component";
import './postCard.css';

const PostCard = ({ post, onApprove, onReject }) => {
  const { user } = useUser();


  const [updatedPost, setUpdatedPost] = useState(null);

  if (!post) return null;


  const postStatus = post.status || 'approved';
  const postType = post.type || 'general';
  const postLikes = post.likes || [];
  const postComments = post.comments || [];
  const postAuthor = post.author?.name || post.author || 'Unknown';
  const postAuthorImage = post.author?.profilePic || post.authorImage || '/default-avatar.png';
  const postDate = post.date || new Date(post.createdAt).toLocaleDateString('ar-EG') || '';


  if (updatedPost === null) {
    setUpdatedPost({
      ...post,
      comments: postComments,
      likes: postLikes
    });
  }

  const showPendingStatus = (postStatus === 'pending' &&
    ((post.author?._id === user?.id) || user?.role === 'admin'));

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

  // const isAdmin = user?.role === 'admin';
  const isPending = postStatus === 'pending';
  const handleCommentAdded = (newComment) => {
    setUpdatedPost(prev => ({
      ...prev,
      comments: [...prev.comments, newComment]
    }));
  };

  return (
    <div className={`post-card ${postStatus} ${postType}`}
      style={{
        borderLeft: `4px solid ${statusColors[postStatus]}`,
        opacity: postStatus === 'rejected' ? 0.7 : 1
      }}>
      {showPendingStatus && (
        <div className="pending-badge">
          ⏳ قيد المراجعة (فقط أنت والمسؤولون يمكنهم رؤية هذا)
        </div>
      )}
      {(user.role === "admin" && isPending) && (
        <div className="admin-actions">
          <h4>إجراءات المسؤول:</h4>
          <button
            onClick={() => onApprove(post._id || post.id)}
            className="approve-btn"
          >
            ✅ قبول المنشور
          </button>
          <button
            onClick={() => onReject(post._id || post.id)}
            className="reject-btn"
          >
            ❌ رفض المنشور
          </button>
        </div>
      )}
      <div className="post-meta">
        <span className="post-type-badge">
          {postTypeLabels[postType]}
        </span>
        <span className="post-status" style={{
          backgroundColor: statusColors[postStatus]
        }}>
          {postStatus === 'pending' ? 'قيد المراجعة' :
            postStatus === 'approved' ? 'مقبول' : 'مرفوض'}
        </span>
      </div>
      <div className="post-header">
        <img
          src={postAuthorImage}
          alt={postAuthor}
          className="post-author-avatar"
        />
        <div className="post-author-info">
          <h4>{postAuthor}</h4>
          <span className="post-date">{postDate}</span>
        </div>
      </div>

      <div className="post-content">
        <p>{post.content}</p>
        {post.image && (
          <img
            src={post.image} 
            alt="صورة المنشور"
            className="post-image"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />

        )
        }
      </div>
      {updatedPost && (
        <Comment
          post={updatedPost}
          user={user}
          onCommentAdded={handleCommentAdded}
        />
      )}
    </div>
  );
};

export default PostCard;