import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { register } from "../../services/authService";
import { toast, Bounce } from 'react-toastify';
import '../../assets/auth.css'

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    universityId: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (input) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
  const validatePassword = (input) => /^(?=.*\d).{8,}$/.test(input);
  const validateUniversityId = (input) => /^\d{7}$/.test(input);
  const validateName = (input) => /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u0041-\u005A\u0061-\u007A ]+$/u.test(input);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = {
      name: validateName(formData.name) ? '' : 'الاسم يجب أن يحتوي على أحرف فقط',
      email: validateEmail(formData.email) ? '' : 'بريد غير صحيح',
      universityId: validateUniversityId(formData.universityId) ? '' : 'رقم الطالب يجب أن يتكون من 7 أرقام',
      password: validatePassword(formData.password) ? '' : 'كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل ورقم واحد',
      confirmPassword: formData.password === formData.confirmPassword ? '' : 'كلمات المرور غير متطابقة'
    };

    setErrors(validationErrors);

    if (Object.values(validationErrors).every(error => !error)) {
      try {
        setIsLoading(true);
        const result = await register(formData);
        
        if (result.success) {
          toast.success('تم إنشاء الحساب بنجاح', {
            position: "top-right",
            transition: Bounce,
          });
          navigate('/');
        } else {
          toast.error(result.message || 'حدث خطأ أثناء التسجيل', {
            position: "top-right",
            transition: Bounce,
          });
        }
      } catch (error) {
        toast.error('حدث خطأ أثناء التسجيل', {
          position: "top-right",
          transition: Bounce,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h2>إنشاء حساب جديد</h2>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">الاسم الكامل</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">البريد الإلكتروني</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="universityId">رقم الطالب الجامعي</label>
            <input
              type="text"
              id="universityId"
              name="universityId"
              value={formData.universityId}
              onChange={handleChange}
              className={errors.universityId ? 'error' : ''}
              maxLength="7"
            />
            {errors.universityId && <span className="error-message">{errors.universityId}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">كلمة المرور</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">تأكيد كلمة المرور</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'error' : ''}
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          <button type="submit" className="auth-btn" disabled={isLoading}>
            {isLoading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}
          </button>
        </form>

        <div className="auth-footer">
          <span>لديك حساب بالفعل؟ <button className="text-btn" onClick={() => navigate('/login')}>تسجيل الدخول</button></span>
        </div>
      </div>
    </div>
  );
};

export default Register;