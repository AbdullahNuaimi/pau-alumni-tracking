import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
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
import AdminArticlesList from './pages/AdminArticlesList/adminArticlesList.page';
import CertificateGenerator from './components/CertificateGenerator/CertificateGenerator.component';
import Guard from './components/Guard/Guard.component';
import MainPage from './pages/Main/main.page'; 
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
          <Route path="/dashboard" element={<Guard allowedRoles={['admin']}><Dashboard /></Guard>} />
          <Route path="/" element={<MainPage />} />
          <Route path="/GraduationBook" element={<Guard allowedRoles={['admin','user']}><GraduationBook /></Guard>} />
          <Route path="/ProfilePage" element={<Guard allowedRoles={['admin','user']}><ProfilePage /></Guard>} />
          <Route path="/ViewProfile/:userId" element={<Guard allowedRoles={['admin','user']}><ViewProfile /></Guard>} />
          <Route path="/community" element={<Guard allowedRoles={['admin','user']}><Community /></Guard>} />
          <Route path="/posts/:postId/full" element={<Guard allowedRoles={['admin','user']}><PostDetail /></Guard>} />
          <Route path="/community/jobs" element={<Guard allowedRoles={['admin','user']}><Community jobs /></Guard>} />
          <Route path="/community/success-stories" element={<Guard allowedRoles={['admin','user']}><Community successStories /></Guard>} />
          <Route path="/news" element={<Guard allowedRoles={['admin','user']}><NewsAndPhotos /></Guard>}/>
          <Route path="/articles/:id" element={<Guard allowedRoles={['admin','user']}><ArticleDetail /></Guard>} />
          <Route path="/admin/articles/new" element={<Guard allowedRoles={['admin']}><AdminArticleEditor /></Guard>} />
          <Route path="/admin/articles/edit/:id" element={<Guard allowedRoles={['admin']}><AdminArticleEditor /></Guard>} />
          <Route path="/admin/articles" element={<Guard allowedRoles={['admin']}><AdminArticlesList /></Guard>} />
          <Route path="/admin/certificate" element={<Guard allowedRoles={['admin']}><CertificateGenerator /></Guard>} />
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
          <AppRoutes /> 
        </BrowserRouter>
      </UserProvider>
    </div>
  );
}

export default App;