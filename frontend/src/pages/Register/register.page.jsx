import "./register.css"

const Register = () => {

  return (
    <div className="register-page">

      <div className="signup-container">
        <h2>إنشاء حساب جديد</h2>
        <form action="login.html" method="POST">
          <div className="input-group">
            <label for="email">البريد الإلكتروني</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className="input-group">
            <label for="university-id">رقم الطالب الجامعي (اذا كان الطالب ما زال بالجامعة)</label>
            <input type="text" id="university-id" name="university-id" />
          </div>
          <div className="input-group">
            <label for="password">كلمة المرور</label>
            <input type="password" id="password" name="password" required />
          </div>
          <div className="input-group">
            <label for="confirm-password">تأكيد كلمة المرور</label>
            <input type="password" id="confirm-password" name="cFonfirm-password" required />
          </div>
          <button type="submit" className="signup-btn">إنشاء الحساب</button>
        </form>
        <a href="/" className="back-link">لديك حساب بالفعل؟ تسجيل الدخول</a>
      </div>
    </div>
  );
};

export default Register;