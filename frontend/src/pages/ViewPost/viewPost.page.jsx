import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaHeart, FaRegHeart, FaComment, FaArrowLeft, FaUser } from 'react-icons/fa';
import './viewPost.css';
import { useUser } from '../../contexts/UserContext';

const PostDetail = () => {
  const {user} = useUser();
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/api/v1/posts/${postId}/full`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setPost(response.data.data);
      } catch (error) {
        console.error('Error fetching post:', error);
        toast.error('حدث خطأ أثناء جلب المنشور');
        navigate('/community');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, navigate]);

  const handleLike = async () => {
    if (!post) return;
    try {
      setIsLiking(true);
      await axios.patch(`/api/v1/posts/${post._id}/like`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setPost(prev => {
        const isLiked = prev.likes.includes(user._id);
        const newLikes = isLiked 
          ? prev.likes.filter(id => id !== user._id) 
          : [...prev.likes, user._id];
        return { ...prev, likes: newLikes };
      });
    } catch (error) {
      console.error('Error liking post:', error);
      toast.error('حدث خطأ أثناء تسجيل الإعجاب');
    } finally {
      setIsLiking(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      const response = await axios.post(`/api/v1/posts/${postId}/comments`, {
        content: newComment
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setPost(prev => ({
        ...prev,
        comments: [response.data.data, ...(prev.comments || [])]
      }));
      setNewComment('');
      toast.success('تم إضافة التعليق بنجاح');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('حدث خطأ أثناء إضافة التعليق');
    }
  };

  if (loading) {
    return <div className="loading">جاري التحميل...</div>;
  }

  if (!post) {
    return <div className="error">لا يمكن العثور على المنشور</div>;
  }

  const isLiked = post.likes.includes(user._id);
  const likeCount = post.likes.length;

  return (
    <div className="post-detail-container">
      <button onClick={() => navigate("/community")} className="back-button">
        <FaArrowLeft /> العودة
      </button>

      <div className="post-content-card">
        <div className="post-header">
          <div className="author-info">
            {post.author.profilePic ? (
              <img 
                src={post.author.profilePic} 
                alt={post.author.name}
                className="author-avatar"
              />
            ) : (
              <div className="author-avatar default">
                <FaUser />
              </div>
            )}
            <div>
              <h3>{post.author.name}</h3>
              <span className="post-date">
                {new Date(post.createdAt).toLocaleDateString('ar-EG')}
              </span>
            </div>
          </div>
          <span className={`post-type ${post.type}`}>
            {post.type === 'general' ? 'عام' : 
             post.type === 'announcement' ? 'إعلان' :
             post.type === 'job' ? 'وظيفة' : 'قصة نجاح'}
          </span>
        </div>

        <div className="post-body">
          <p className="post-text">{post.content}</p>
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
            onClick={handleLike}
            disabled={isLiking}
            className={`like-button ${isLiked ? 'liked' : ''}`}
          >
            {isLiked ? <FaHeart color="red" /> : <FaRegHeart />}
            <span>{likeCount}</span>
          </button>
          <div className="comment-count">
            <FaComment /> {post.comments.length}
          </div>
        </div>
      </div>

      <div className="comments-section">
        <h2>التعليقات ({post.comments.length})</h2>
        
        <div className="add-comment">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="أضف تعليقاً..."
            rows="3"
          />
          <button 
            onClick={handleAddComment} 
            className="comment-submit"
            disabled={!newComment.trim()}
          >
            نشر التعليق
          </button>
        </div>

        <div className="comments-list">
          {post.comments.length > 0 ? (
            post.comments.map(comment => (
              <div key={comment._id} className="comment">
                <div className="comment-author">
                  {comment.author.profilePic ? (
                    <img 
                      src={comment.author.profilePic} 
                      alt={comment.author.name}
                      className="comment-avatar"
                    />
                  ) : (
                    <div className="comment-avatar default">
                      <FaUser />
                    </div>
                  )}
                  <h4>{comment.author.name}</h4>
                </div>
                <p className="comment-text">{comment.content}</p>
                <span className="comment-date">
                  {new Date(comment.createdAt).toLocaleDateString('ar-EG')}
                </span>
              </div>
            ))
          ) : (
            <p className="no-comments">لا توجد تعليقات بعد</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;