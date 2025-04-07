import './createPost.css'; 
import { useState, useRef } from 'react';
import { useUser } from '../../contexts/UserContext';

const CreatePost = ({ onPostSubmit }) => {
  const { user } = useUser();
  const [postText, setPostText] = useState('');
  const [postType, setPostType] = useState('general');
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const postTypes = [
    { value: 'general', label: 'منشور عام' },
    { value: 'announcement', label: 'إعلان' },
    { value: 'job', label: 'فرصة عمل' },
    { value: 'success', label: 'قصة نجاح' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!postText.trim() && !imagePreview) return;

    const newPost = {
      id: Date.now(),
      author: user.name,
      authorImage: user.profilePic,
      content: postText,
      image: imagePreview,
      type: postType,
      status: 'pending', // Default status
      date: new Date().toLocaleDateString('ar-EG'),
      likes: [], 
      comments: []
    };

    onPostSubmit(newPost);
    setPostText('');
    setPostType('general');
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
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
        <div className="post-type-selector">
          <label>نوع المنشور:</label>
          <select 
            value={postType} 
            onChange={(e) => setPostType(e.target.value)}
          >
            {postTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
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