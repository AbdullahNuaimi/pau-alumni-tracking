import { useState, useRef } from 'react';
import { useUser } from '../../contexts/UserContext';
import './createPost.css'; 

const CreatePost = ({ onPostSubmit }) => {
  const { user } = useUser();
  const [postText, setPostText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!postText.trim() && !imagePreview) return;

    const newPost = {
      id: Date.now(),
      author: user.name,
      authorImage: user.profilePic,
      title: postText.slice(0, 30) + (postText.length > 30 ? '...' : ''),
      content: postText,
      image: imagePreview,
      date: new Date().toLocaleDateString('ar-EG'),
    };

    onPostSubmit(newPost);
    setPostText('');
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="create-post">
      <form onSubmit={handleSubmit}>
        <div className="post-input">
          <img 
            src={user.profilePic || '/default-avatar.png'} 
            alt="صورة الملف الشخصي" 
            className="author-avatar"
          />
          <textarea
            type="text"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder="ما الذي يدور في ذهنك؟"
            className="post-textbox"
          />
        </div>

        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="معاينة الصورة" />
            <button 
              type="button" 
              onClick={() => setImagePreview(null)}
              className="remove-image-btn"
            >
              إزالة الصورة
            </button>
          </div>
        )}

        <div className="post-actions">
          <label className="upload-btn">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />
            <span>📷 رفع صورة</span>
          </label>
          <button type="submit" className="post-btn">
            نشر
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;