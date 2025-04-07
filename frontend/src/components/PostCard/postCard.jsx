import { useUser } from "../../contexts/UserContext";
import './postCard.css';
const PostCard = ({ post }) => {
  const { user } = useUser();

  return (
    <div className="post-card">
      <div className="post-header">
        <img 
          src={post.authorImage || '/default-avatar.png'} 
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
        <button>👍 أعجبني</button>
        <button>💬 تعليق</button>
        {post.author === user.name && (
          <button className="delete-btn">🗑️ حذف</button>
        )}
      </div>
    </div>
  );
};

export default PostCard;