import { useUser } from "../../contexts/UserContext";
import { useState } from 'react';
import Comment from "../Comment/comment.component";
import { FaHeart, FaRegHeart, FaTimes } from 'react-icons/fa';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import './postCard.css';

const PostCard = ({ post, onApprove, onReject, onLike, isDetailView = false }) => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [updatedPost, setUpdatedPost] = useState(null);
  const [isLiking, setIsLiking] = useState(false);
  const [isImageFullscreen, setIsImageFullscreen] = useState(false);

  const handleImageClick = () => {
    setIsImageFullscreen(true);
  };

  const closeFullscreen = () => {
    setIsImageFullscreen(false);
  };


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
      comments: prev.comments ? [...prev.comments, newComment] : [newComment]
    }));
  };


  const isLiked = updatedPost?.likes?.includes(user?.id);
  const likeCount = updatedPost?.likes?.length || 0;

  const handleLike = async () => {
    if (!user) {
      toast.error('يجب تسجيل الدخول للإعجاب بالمنشور');
      return;
    }

    try {
      setIsLiking(true);
      await onLike(post._id || post.id);

      setUpdatedPost(prev => {
        const newLikes = isLiked
          ? prev.likes.filter(id => id !== user.id)
          : [...prev.likes, user.id];

        return {
          ...prev,
          likes: newLikes
        };
      });
    } catch (error) {
      console.error('Error liking post:', error);
      toast.error('حدث خطأ أثناء تسجيل الإعجاب');
    } finally {
      setIsLiking(false);
    }
  };

  const handleViewUser = (e) => {
    e.stopPropagation();
    navigate(`/ViewProfile/${user._id}`);
  };

  const handlePostClick = (e) => {

    if (
      e.target.closest('.comment-input') ||
      e.target.closest('.like-button') ||
      e.target.closest('.admin-actions')
    ) {
      return;
    }
    navigate(`/posts/${post._id}/full`);
  };


  return (
    <div className={`post-card ${postStatus} ${postType}`}
      style={{
        borderLeft: `4px solid ${statusColors[postStatus]}`,
        opacity: postStatus === 'rejected' ? 0.7 : 1,
        cursor: isDetailView ? 'default' : 'pointer'
      }}
      onClick={!isDetailView ? handlePostClick : undefined}
    >
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
          onClick={handleViewUser}
        />
        <div className="post-author-info">
          <h4>{postAuthor}</h4>
          <span className="post-date">{postDate}</span>
        </div>
      </div>

      <div className="post-content">
        <p>{post.content}</p>
        {post.image && (
          <>
            <img
              src={post.image}
              alt="صورة المنشور"
              className="post-image"
              onClick={handleImageClick}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />

            {isImageFullscreen && (
              <div className="image-fullscreen-overlay" onClick={closeFullscreen}>
                <div className="image-fullscreen-container" onClick={(e) => e.stopPropagation()}>
                  <button className="close-fullscreen-btn" onClick={closeFullscreen}>
                    <FaTimes />
                  </button>
                  <img
                    src={post.image}
                    alt="صورة المنشور مكبرة"
                    className="fullscreen-image"
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <div className="post-footer">
        <button
          onClick={handleLike}
          disabled={isLiking}
          className="like-button"
        >
          {isLiked ? (
            <FaHeart color="red" />
          ) : (
            <FaRegHeart />
          )}
          <span>{likeCount}</span>
        </button>
      </div>
      {updatedPost && (
        <Comment
          post={updatedPost}
          user={user}
          className="comment-input"
          onCommentAdded={handleCommentAdded}
        />
      )}
    </div>
  );
};

export default PostCard;