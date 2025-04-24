import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'; // Add useLocation
import Community from './pages/Community/community.page';
import Dashboard from './pages/Dashboard/dashboard.page';
import Login from './pages/Login/login.page';
import Register from './pages/Register/register.page';
import PostDetail from './pages/ViewPost/viewPost.page';
import GraduationBook from './pages/GraduationBook/graduationBook.page';
import ProfilePage from './pages/ProfilePage/profilePage.page';
import ViewProfile from './pages/ViewProfile/viewProfile.page';
import NewsAndPhotos from './pages/NewsAndPhotos/NewsAndPhotos.page';
import ArticleDetail from './pages/ArticleDetail/ArticleDetail.page';
import AdminArticleEditor from './pages/AdminArticleEditor/AdminArticleEditor.page';
import CertificateGenerator from './components/CertificateGenerator/CertificateGenerator.component';



import NavigationBar from './components/NavigationBar/navigationBar.component';

import { UserProvider } from './contexts/UserContext';
import { ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const AppRoutes = () => {
  const location = useLocation(); 
  
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
          <Route path="/ViewProfile/:userId" element={<ViewProfile />} />
          <Route path="/community" element={<Community />} />
          <Route path="/posts/:postId/full" element={<PostDetail />} />
          <Route path="/community/jobs" element={<Community jobs />} />
          <Route path="/community/success-stories" element={<Community successStories />} />
          <Route path="/news" element={<NewsAndPhotos />} />
        <Route path="/articles/:slug" element={<ArticleDetail />} />
        <Route path="/admin/articles/new" element={<AdminArticleEditor />} />
        <Route path="/admin/articles/edit/:id" element={<AdminArticleEditor />} />
        <Route path="/admin/certificate" element={<CertificateGenerator />} />
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