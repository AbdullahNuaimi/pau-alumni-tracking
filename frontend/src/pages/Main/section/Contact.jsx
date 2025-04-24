import './sections.css';


import { 
    FaPhone, 
    FaEnvelope, 
    FaMapMarkerAlt,
    FaFacebook, 
    FaLinkedin, 
    FaTwitter, 
    FaInstagram 
  } from 'react-icons/fa';
  
const Contact = () => {
    return (
      <section className="contact-section">
        <h2>تواصل معنا</h2>
        <div className="contact-methods">
          <div className="contact-card">
            <FaPhone />
            <h3>هاتف</h3>
            <p>02-275-1566</p>
          </div>
  
          <div className="contact-card">
            <FaEnvelope />
            <h3>بريد إلكتروني</h3>
            <p>alumni@pau.edu.ps</p>
          </div>
  
          <div className="contact-card">
            <FaMapMarkerAlt />
            <h3>العنوان</h3>
            <p>بيت لحم، جبل ظاهر،  جامعة فلسطين الأهلية</p>
          </div>
        </div>
  
        <div className="social-media">
          <h3>وسائل التواصل الاجتماعي</h3>
          <div className="social-icons">
            <a href="https://www.facebook.com"><FaFacebook /></a>
            <a href="https://www.linkedin.com"><FaLinkedin /></a>
            <a href="https://www.x.com"><FaTwitter /></a>
            <a href="https://www.instagram.com"><FaInstagram /></a>
          </div>
        </div>
      </section>
    );
  };

export default Contact;