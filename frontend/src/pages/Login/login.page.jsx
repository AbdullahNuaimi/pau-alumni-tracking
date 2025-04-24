import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { login } from "../../services/authService";
import { toast, Bounce } from 'react-toastify';
import logo from "../../assets/pau_logo.jpg";
import '../../assets/auth.css'

const Login = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (input) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
  const validatePassword = (input) => /^(?=.*\d).{8,}$/.test(input);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    setErrors({
      email: isEmailValid ? '' : 'بريد غير صحيح',
      password: isPasswordValid ? '' : 'كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل ورقم واحد',
    });

    if (isEmailValid && isPasswordValid) {
      try {
        setIsLoading(true);
        const result = await login({ email, password });
        
        if (result.success) {
          setUser(JSON.parse(localStorage.getItem('user')));
          toast.success('تم تسجيل الدخول بنجاح', {
            position: "top-right",
            transition: Bounce,
          });
          navigate('/news');
        } else {
          toast.error('البريد الإلكتروني أو كلمة المرور غير صحيحة', {
            position: "top-right",
            transition: Bounce,
          });
        }
      } catch (error) {
        console.error(error);
        toast.error('حدث خطأ أثناء تسجيل الدخول', {
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
          <img src={logo} alt="شعار الجامعة" className="auth-logo" />
          <h2>تسجيل الدخول</h2>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">البريد الإلكتروني</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">كلمة المرور</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <button type="submit" className="auth-btn" disabled={isLoading}>
            {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </button>
        </form>

        <div className="auth-footer">
          <button 
            className="text-btn"
            onClick={() => navigate('/reset-password')}
          >
            نسيت كلمة المرور؟
          </button>
          <span>ليس لديك حساب؟ <button className="text-btn" onClick={() => navigate('/register')}>سجل الآن</button></span>
        </div>
      </div>
    </div>
  );
};

export default Login;