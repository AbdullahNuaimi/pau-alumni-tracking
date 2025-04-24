import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaUniversity, FaUsers, FaQuestionCircle, FaCogs, FaEnvelope } from 'react-icons/fa';
import About from './section/About';
import Features from './section/Features';
import FAQ from './section/FAQ';
import Contact from './section/Contact';
import './main.css';

const MainPage = () => {
  const [activeTab, setActiveTab] = useState('about');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'about':
        return <About />;
      case 'features':
        return <Features />;
      case 'faq':
        return <FAQ />;
      case 'contact':
        return <Contact />;
      default:
        return <About />;
    }
  };

  return (
    <div className="main-container">
      {/* Hero Section */}
      <header className="hero-section">
        <h1>نظام متابعة خريجي جامعة فلسطين الأهلية</h1>
        <p>منصة تواصل بين الخريجين والجامعة لتعزيز الفرص الوظيفية وتبادل الخبرات</p>
      </header>

      {/* Navigation Tabs */}
      <nav className="main-tabs">
        <button 
          onClick={() => setActiveTab('about')}
          className={activeTab === 'about' ? 'active' : ''}
        >
          <FaUniversity /> من نحن؟
        </button>
        <button 
          onClick={() => setActiveTab('features')}
          className={activeTab === 'features' ? 'active' : ''}
        >
          <FaCogs /> ماذا يقدم النظام؟
        </button>
        <button 
          onClick={() => setActiveTab('faq')}
          className={activeTab === 'faq' ? 'active' : ''}
        >
          <FaQuestionCircle /> الأسئلة الشائعة
        </button>
        <button 
          onClick={() => setActiveTab('contact')}
          className={activeTab === 'contact' ? 'active' : ''}
        >
          <FaEnvelope /> تواصل معنا
        </button>
      </nav>

      {/* Tab Content */}
      <div className="tab-content">
        {renderTabContent()}
      </div>

      {/* Quick Links */}
      <div className="quick-links">
        <NavLink to="/login" className="link-button">
          <FaUsers /> تسجيل الدخول للخريجين
        </NavLink>
      </div>
    </div>
  );
};

export default MainPage;