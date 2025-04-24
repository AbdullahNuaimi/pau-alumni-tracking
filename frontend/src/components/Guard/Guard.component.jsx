import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

const Guard = ({ children, allowedRoles }) => {
const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      toast.error('يجب تسجيل الدخول أولاً');
      navigate('/login');
    } else if (!allowedRoles.includes(user.role)) {
      toast.error('غير مسموح بالوصول');
      navigate('/not-authorized');
    }
  }, [user, allowedRoles, navigate]);

  if (user && allowedRoles.includes(user.role)) {
    return children;
  }

  return null;
};

export default Guard;