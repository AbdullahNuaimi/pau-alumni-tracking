import React from 'react';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import Community from './pages/Community/community.page';
import Dashboard from './pages/Dashboard/dashboard.page';
import Login from './pages/Login/login.page';
import Register from './pages/Register/register.page';
import ViewPost from './pages/ViewPost/viewPost.page';
import GraduationBook from './pages/GraduationBook/graduationBook.page';
import Profile from './pages/profile/profile.page';
import NavigationBar from './components/NavigationBar/navigationBar.component';
function App() {
  return (
    <div>
      <BrowserRouter>
      <NavigationBar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Login />} />
        <Route path='/GraduationBook' element={<GraduationBook />} />
        <Route path='/Profile' element={<Profile />} />
        <Route path="/community" element={<Community />} />
        <Route path="/community/:postId" element={<ViewPost />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;