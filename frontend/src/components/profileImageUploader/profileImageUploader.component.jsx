import { useState, useRef, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import axios from 'axios';
import { toast, Bounce } from 'react-toastify';
import './profileImageUploader.css';

const ProfileImageUploader = () => {
  const { user, setUser } = useUser();
  const [editMode, setEditMode] = useState(false);
  const [previewImage, setPreviewImage] = useState(user?.profilePic || '');
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setPreviewImage(user?.profilePic || '');
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      toast.error('الرجاء اختيار ملف صورة فقط', { transition: Bounce });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('حجم الصورة يجب أن يكون أقل من 2MB', { transition: Bounce });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!previewImage || previewImage === user?.profilePic) {
      setEditMode(false);
      return;
    }

    try {
      setIsUploading(true);
      
      const response = await axios.put(
        '/api/v1/auth/updateProfileImage',
        {
          id: user._id,
          profilePic: previewImage
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        setUser(response.data.data);
        localStorage.setItem('user', JSON.stringify(response.data.data));
        toast.success('تم تحديث صورة البروفايل بنجاح', { transition: Bounce });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء تحديث الصورة', { 
        transition: Bounce 
      });
      setPreviewImage(user?.profilePic || '');
    } finally {
      setIsUploading(false);
      setEditMode(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="profile-image-uploader">
      <div className="image-container">
        <img 
          src={previewImage} 
          alt="Profile" 
          className={`profile-image ${editMode ? 'editable' : ''}`}
          onClick={editMode ? triggerFileInput : undefined}
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
      </div>

      <div className="controls">
        {editMode ? (
          <>
            <button 
              className="save-btn"
              onClick={handleSave}
              disabled={isUploading || previewImage === user?.profilePic}
            >
              {isUploading ? 'جاري التحميل...' : 'حفظ الصورة'}
            </button>
            <button 
              className="cancel-btn"
              onClick={() => {
                setPreviewImage(user?.profilePic || '');
                setEditMode(false);
              }}
              disabled={isUploading}
            >
              إلغاء
            </button>
          </>
        ) : (
          <button 
            className="edit-btn"
            onClick={() => setEditMode(true)}
          >
            تغيير الصورة
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileImageUploader;