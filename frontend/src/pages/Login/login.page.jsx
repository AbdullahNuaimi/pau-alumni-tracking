import "./login.css"
import logo from "../../assets/pau_logo.jpg";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { login } from "../../services/authService";
import { toast, Bounce } from 'react-toastify'
const Login = () => {
  const { user,setUser } = useUser();
  const [wrong, setWrong] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [passwordReset, setPasswordReset] = useState(false);

  const validateEmail = (input) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
  const validatePassword = (input) => /^(?=.*\d).{8,}$/.test(input);

  const notify = () => toast.success('تم تسجيل الدخول بنجاح', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    setErrors({
      email: isEmailValid ? '' : 'بريد غير صحيح',
      password: isPasswordValid ? '' : 'كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل ورقم واحد',
    });
    const result = await login({ email: email, password: password });
    if (!result.success) {
      setWrong(true);
    }
    if (isEmailValid && isPasswordValid && result.success) {
      setUser(JSON.parse(localStorage.getItem("user")));
      console.log("user from local storage: ", user);
      notify()
      navigate('/dashboard');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <img src={logo} alt="شعار جامعة فلسطين الأهلية" className="logo" />
        <h2>تسجيل الدخول</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">البريد الإلكتروني</label>
            <input type="text" id="email" name="email" onChange={(e) => setEmail(e.target.value)} />
            {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
          </div>
          <div className="input-group">
            <label htmlFor="password">كلمة المرور</label>
            <input type="password" id="password" name="password" onChange={(e) => setPassword(e.target.value)} />
            {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
          </div>
          <button type="submit" className="login-btn">تسجيل الدخول</button>
        </form>
        <div className="links">
          <a onClick={() => { setPasswordReset(true) }}>نسيت كلمة المرور؟</a>
          {passwordReset && <p style={{ color: 'green' }}>تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.</p>}
          {wrong && <p style={{ color: 'red' }}>البريد الالكتروني او كلمة المرير غير صحيحة.</p>}
          <a onClick={() => { navigate("/register") }}>إنشاء حساب جديد</a>
        </div>
      </div>
    </div>
  );
};

export default Login;