import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import ConversationsList from '../../components/ConversationsList/ConversationsList.component';
import SearchBox from '../../components/SearchBox/SearchBox.component';
import './MessagingLayout.css';

const MessagingLayout = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="messaging-container">
      <div className="messaging-sidebar">
        <SearchBox value={searchQuery} onChange={setSearchQuery} />
        <ConversationsList searchQuery={searchQuery} />
      </div>
      <div className="conversation-view">
        <Outlet />
      </div>
    </div>
  );
};

export default MessagingLayout;