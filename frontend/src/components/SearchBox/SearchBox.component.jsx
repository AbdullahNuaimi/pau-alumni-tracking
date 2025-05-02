import { useState, useEffect } from 'react';
import { FaSearch, FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SearchBox.css';

const SearchBox = ({ value, onChange }) => {
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (value.trim()) {
      setIsLoading(true);
      const timer = setTimeout(async () => {
        try {
          const { data } = await axios.get(`/api/v1/messages/findMessageOrUser/search?query=${value}`);
          setSearchResults(data);
        } catch (error) {
          console.error('Search failed', error);
          setSearchResults({ users: [], messages: [] });
        } finally {
          setIsLoading(false);
        }
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setSearchResults(null);
    }
  }, [value]);

  const handleUserClick = (userId) => {
    navigate(`/messages/${userId}`);
    setSearchResults(null);
    onChange('');
  };

  const handleMessageClick = (message) => {
    navigate(`/messages/${message.sender._id}`);
    setSearchResults(null);
    onChange('');
  };

  return (
    <div className="search-container">
      <div className="search-input">
        {isLoading ? (
          <FaSpinner className="search-icon spin" />
        ) : (
          <FaSearch className="search-icon" />
        )}
        <input
          type="text"
          placeholder="ابحث عن مستخدمين أو رسائل..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Search for users or messages"
        />
      </div>
      
      {searchResults && (
        <div className="search-results">
          {searchResults.users.length === 0 && searchResults.messages.length === 0 ? (
            <div className="no-results">
              <p>لا توجد نتائج لـ "{value}"</p>
            </div>
          ) : (
            <>
              {searchResults.users.length > 0 && (
                <div className="result-section">
                  <h4>المستخدمون</h4>
                  {searchResults.users.map(user => (
                    <div 
                      key={user._id} 
                      className="result-item"
                      onClick={() => handleUserClick(user._id)}
                    >
                      {user.profilePic ? (
                        <img src={user.profilePic} alt={user.name} />
                      ) : (
                        <div className="avatar-placeholder">{user.name.charAt(0)}</div>
                      )}
                      <span>{user.name}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {searchResults.messages.length > 0 && (
                <div className="result-section">
                  <h4>الرسائل</h4>
                  {searchResults.messages.map(message => (
                    <div 
                      key={message._id} 
                      className="result-item"
                      onClick={() => handleMessageClick(message)}
                    >
                      <div className="message-excerpt">
                        <strong>{message.sender.name}: </strong>
                        {message.content.slice(0, 50)}...
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBox;