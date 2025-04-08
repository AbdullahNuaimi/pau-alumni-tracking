import "./register.css"
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { DEFAULT_PROFILE_IMAGE } from "../../assets/defaultPfpBase64";
const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [universityId, setUniversityId] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({ email: '', password: '', confirmPassword: '', universityId: '', name: '' });
    
    const validateEmail = (input) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
    const validatePassword = (input) => /^(?=.*\d).{8,}$/.test(input);
    const validateUniversityId = (input) => /^\d{7}$/.test(input); 
    const validateName = (input) => /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u0041-\u005A\u0061-\u007A ]+$/u.test(input); 
  
    const handleSubmit = (e) => {
      e.preventDefault();
      const isEmailValid = validateEmail(email);
      const isPasswordValid = validatePassword(password);
      const isUniversityIdValid = validateUniversityId(universityId);
      const isNameValid = validateName(name);
  
      setErrors({
        email: isEmailValid ? '' : 'بريد غير صحيح',
        password: isPasswordValid ? '' : 'كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل ورقم واحد',
        confirmPassword: password === confirmPassword ? '' : 'كلمات المرور غير متطابقة',
        universityId: isUniversityIdValid ? '' : 'رقم الطالب يجب أن يتكون من 7 أرقام',
        name: isNameValid ? '' : 'الاسم يجب أن يكون الاسم مكون من احرف فقط',
      });
  
      if (isEmailValid && isPasswordValid && isUniversityIdValid && password === confirmPassword && isNameValid) {
        // console.log('Form submitted:', { email, password, universityId, confirmPassword});
        const newUser = {
          id: universityId,
          name: name,
          email: email,
          password: password,
          phone: '',
          role: 'user',
          isAdmin: false, 
          profilePic: DEFAULT_PROFILE_IMAGE,
          education: [],
          career: [],
          registerDate: new Date().toISOString(),
        };
        console.log('New user:', newUser);
        // navigate('/');

      }
    };
  return (
    <div className="register-page">

      <div className="signup-container">
        <h2>إنشاء حساب جديد</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label for="name">الإسم</label>
            <input type="text" id="name" name="name" onChange={(e)=>{setName(e.target.value)}} />
            {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
          </div>
          <div className="input-group">
            <label for="email">البريد الإلكتروني</label>
            <input type="text" id="email" name="email" onChange={(e)=>{setEmail(e.target.value)}} />
            {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
          </div>
          <div className="input-group">
            <label for="university-id">رقم الطالب الجامعي</label>
            <input type="text" id="university-id" name="university-id" onChange={(e)=>{setUniversityId(e.target.value)}}/>
            {errors.universityId && <p style={{ color: 'red' }}>{errors.universityId}</p>}
          </div>
          <div className="input-group">
            <label for="password">كلمة المرور</label>
            <input type="password" id="password" name="password" onChange={(e)=>{setPassword(e.target.value)}} />
            {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
          </div>
          <div className="input-group">
            <label for="confirm-password">تأكيد كلمة المرور</label>
            <input type="password" id="confirm-password" name="cFonfirm-password" onChange={(e)=>{setConfirmPassword(e.target.value)}} />
            {errors.confirmPassword && <p style={{ color: 'red' }}>{errors.confirmPassword}</p>}
          </div>
          <button type="submit" className="signup-btn">إنشاء الحساب</button>
        </form>
        <a onClick={()=>navigate('/')} className="back-link">لديك حساب بالفعل؟ تسجيل الدخول</a>
      </div>
    </div>
  );
};

export default Register;