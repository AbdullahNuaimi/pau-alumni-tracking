import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useUser } from '../../contexts/UserContext';

const Guard = ({ children, allowedRoles }) => {
const {user} = useUser();
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

  // If user has permission, render children
  if (user && allowedRoles.includes(user.role)) {
    return children;
  }

  // Otherwise, render nothing (or loading spinner)
  return null;
};

export default Guard;