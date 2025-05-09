import { useState } from 'react';
import { useUser } from '../../contexts/UserContext';
import axios from 'axios';
import { toast, Bounce } from 'react-toastify';
import './passwordUpdater.css';

const PasswordUpdater = () => {
  const { user } = useUser();
  const [editMode, setEditMode] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: ''
  });
  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (password) => {
    // At least 8 characters with at least 1 number
    const regex = /^(?=.*\d).{8,}$/;
    return regex.test(password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
    
    // Clear error when typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { currentPassword: '', newPassword: '' };

    if (!passwords.currentPassword) {
      newErrors.currentPassword = 'كلمة المرور الحالية مطلوبة';
      isValid = false;
    }

    if (!passwords.newPassword) {
      newErrors.newPassword = 'كلمة المرور الجديدة مطلوبة';
      isValid = false;
    } else if (!validatePassword(passwords.newPassword)) {
      newErrors.newPassword = 'يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل وتحتوي على رقم واحد على الأقل';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      
      const response = await axios.put(
        '/api/v1/auth/updatePassword',
        {
          id: user._id,
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        toast.success('تم تحديث كلمة المرور بنجاح', { transition: Bounce });
        setPasswords({ currentPassword: '', newPassword: '' });
        setEditMode(false);
      }
    } catch (error) {
      console.error('Password update error:', error);
      
      if (error.response?.data?.message === 'كلمة المرور الحالية غير صحيحة') {
        setErrors(prev => ({ ...prev, currentPassword: error.response.data.message }));
      } else {
        toast.error(error.response?.data?.message || 'حدث خطأ أثناء تحديث كلمة المرور', { 
          transition: Bounce 
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="password-updater">
      <div className="password-header">
        <h3>تغيير كلمة المرور</h3>
        <button 
          className={`edit-toggle-btn ${editMode ? 'cancel' : ''}`}
          onClick={() => {
            setEditMode(!editMode);
            setPasswords({ currentPassword: '', newPassword: '' });
            setErrors({ currentPassword: '', newPassword: '' });
          }}
          disabled={isLoading}
        >
          {editMode ? 'إلغاء' : 'تغيير كلمة المرور'}
        </button>
      </div>

      {editMode && (
        <form onSubmit={handleSubmit} className="password-form">
          <div className="form-group">
            <label htmlFor="currentPassword">كلمة المرور الحالية</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={passwords.currentPassword}
              onChange={handleChange}
              className={errors.currentPassword ? 'error' : ''}
            />
            {errors.currentPassword && (
              <span className="error-message">{errors.currentPassword}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">كلمة المرور الجديدة</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={passwords.newPassword}
              onChange={handleChange}
              className={errors.newPassword ? 'error' : ''}
            />
            {errors.newPassword && (
              <span className="error-message">{errors.newPassword}</span>
            )}
            <div className="password-hint">
              يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل وتحتوي على رقم واحد على الأقل
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="save-btn"
              disabled={isLoading}
            >
              {isLoading ? 'جاري الحفظ...' : 'حفظ كلمة المرور الجديدة'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PasswordUpdater;