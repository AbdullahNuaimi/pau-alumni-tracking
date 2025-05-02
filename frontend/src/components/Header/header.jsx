import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaUserCircle } from 'react-icons/fa';
import { useUser } from '../../contexts/UserContext';
import Notification from '../Notification/Notification';
import './header.css';

const Header = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left">
          <div className="header-icon" onClick={() => navigate('/messages')}>
            <FaEnvelope />
          </div>

          <Notification />
        </div>

        {/* <div className="header-right">
          <div className="header-icon" onClick={() => navigate('/messages')}>
            <FaEnvelope />
          </div>
          
          <Notification />
          
          <div className="header-icon" onClick={() => navigate('/ProfilePage')}>
            {user.profilePic ? (
              <img src={user.profilePic} alt="Profile" className="profile-pic" />
            ) : (
              <FaUserCircle size={24} />
            )}
          </div>
        </div> */}
        <div className="header-icon" onClick={() => navigate('/ProfilePage')}>
          {user.profilePic ? (
            <img src={user.profilePic} alt="Profile" className="profile-pic" />
          ) : (
            <FaUserCircle size={24} />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;