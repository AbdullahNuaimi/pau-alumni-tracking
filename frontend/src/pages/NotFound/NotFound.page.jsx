import { useNavigate } from 'react-router-dom';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';
import './NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <FaExclamationTriangle className="error-icon" />
        <h1>404 - الصفحة غير موجودة</h1>
        <p>عذراً، الصفحة التي تبحث عنها غير موجودة أو قد تم نقلها.</p>
        <button 
          onClick={() => navigate('/')}
          className="home-button"
        >
          <FaHome /> العودة إلى الصفحة الرئيسية
        </button>
      </div>
    </div>
  );
};

export default NotFound;