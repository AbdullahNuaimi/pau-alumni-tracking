import "./login.css"
import logo from "../../assets/pau_logo.jpg";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const navigate = useNavigate();
  return (
    <div className="login-page">
      <div className="login-container">
        <img src={logo} alt="شعار جامعة فلسطين الأهلية" className="logo" />
        <h2>تسجيل الدخول</h2>
        <form action="dashboard.html" method="POST">
          <div className="input-group">
            <label for="email">البريد الإلكتروني</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className="input-group">
            <label for="password">كلمة المرور</label>
            <input type="password" id="password" name="password" required />
          </div>
          <button type="button" className="login-btn" onClick={()=>{navigate('/dashboard')}}>تسجيل الدخول</button>
        </form>
        <div className="links">
          <a href="Password_reset.html">نسيت كلمة المرور؟</a>
          <a href="register">إنشاء حساب جديد</a>
        </div>
      </div>
    </div>
  );
};

export default Login;