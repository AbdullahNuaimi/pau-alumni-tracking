import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import ConversationsList from '../../components/ConversationsList/ConversationsList.component';
import SearchBox from '../../components/SearchBox/SearchBox.component';
import './MessagingLayout.css';

const MessagingLayout = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  return (
    <div className="messaging-container">
      <div className="messaging-sidebar">
        <div className="sidebar-header">
          <h2>المحادثات</h2>
          <SearchBox value={searchQuery} onChange={setSearchQuery} />
        </div>
        <ConversationsList 
          searchQuery={searchQuery} 
          currentActive={location.pathname.split('/').pop()} 
        />
      </div>
      <div className="conversation-view">
        <Outlet />
      </div>
    </div>
  );
};

export default MessagingLayout;