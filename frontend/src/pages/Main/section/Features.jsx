import './sections.css';
import { 
    FaNetworkWired,
    FaBriefcase,
    FaChalkboardTeacher,
    FaBook 
  } from 'react-icons/fa';
  
const Features = () => {
    return (
      <section className="features-section">
        <h2>مميزات النظام</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="icon"><FaNetworkWired /></div>
            <h3>شبكة الخريجين</h3>
            <p>تواصل مع زملائك الخريجين في مختلف التخصصات والمجالات المهنية</p>
          </div>
  
          <div className="feature-card">
            <div className="icon"><FaBriefcase /></div>
            <h3>الوظائف الشاغرة</h3>
            <p>تصفح أحدث الفرص الوظيفية المقدمة من شركات توظيف الخريجين</p>
          </div>
  
          <div className="feature-card">
            <div className="icon"><FaChalkboardTeacher /></div>
            <h3>ورش العمل</h3>
            <p>شارك في ورش العمل والدورات التدريبية التي تنظمها الجامعة</p>
          </div>
  
          <div className="feature-card">
            <div className="icon"><FaBook /></div>
            <h3>كتاب التخرج</h3>
            <p>احصل على نسخة إلكترونية من كتاب التخرج عند الطلب</p>
          </div>
        </div>
      </section>
    );
  };

export default Features