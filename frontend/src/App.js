import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'; // Add useLocation
import Community from './pages/Community/community.page';
import Dashboard from './pages/Dashboard/dashboard.page';
import Login from './pages/Login/login.page';
import Register from './pages/Register/register.page';
import ViewPost from './pages/ViewPost/viewPost.page';
import GraduationBook from './pages/GraduationBook/graduationBook.page';
import ProfilePage from './pages/ProfilePage/profilePage.page';
import ViewProfile from './pages/ViewProfile/viewProfile.page';

import NavigationBar from './components/NavigationBar/navigationBar.component';

import { UserProvider } from './contexts/UserContext';
import { ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Create a separate component for the route logic
const AppRoutes = () => {
  const location = useLocation(); // Properly get location
  
  return (
    <>
      {!['/', '/login', '/register'].includes(location.pathname) && <NavigationBar />}
      <main className={`content ${['/', '/login', '/register'].includes(location.pathname) ? 'auth-page' : ''}`}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Login />} />
          <Route path="/GraduationBook" element={<GraduationBook />} />
          <Route path="/ProfilePage" element={<ProfilePage />} />
          <Route path="/ViewProfile/:id" element={<ViewProfile />} />
          <Route path="/community" element={<Community />} />
          <Route path="/community/:postId" element={<ViewPost />} />
          <Route path="/community/jobs" element={<Community jobs />} />
          <Route path="/community/success-stories" element={<Community successStories />} />
        </Routes>
      </main>
    </>
  );
};

function App() {
  return (
    <div className="app-container">
      <UserProvider>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={true}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
        <BrowserRouter>
          <AppRoutes /> {/* Use the new component */}
        </BrowserRouter>
      </UserProvider>
    </div>
  );
}

export default App;