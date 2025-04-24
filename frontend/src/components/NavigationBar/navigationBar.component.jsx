import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router";
import { logout } from "../../services/authService";
import { useUser } from '../../contexts/UserContext';


import {
    FaHome,
    FaComments,
    FaBriefcase,
    FaBook,
    FaStar,
    FaUser,
    FaSignOutAlt,
    FaBars,
    FaTimes,
    FaNewspaper,
    FaImage
} from 'react-icons/fa';
import "./navigationBar.css";
import logo from "../../assets/navigation_bar_logo.png";

const NavigationBar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const { user } = useUser();


    const handleLogout = async () => {
        const result = await logout(true);
        if (result.success) {
            navigate("/");
        }
    }

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) {
                setIsOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (location.pathname === "/" || location.pathname === "/register") {
        return null;
    }

    return (
        <>
            {isMobile && (
                <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <FaTimes /> : <FaBars />}
                </button>
            )}

            <div className={`sidebar ${isOpen ? 'open' : ''} ${isMobile ? 'mobile' : ''}`}>
                <div className="logo">
                    <img src={logo} alt="شعار الجامعة" />
                    <h2>موقع الخريجين</h2>
                </div>
                <ul>
                    <li><button onClick={() => { navigate("dashboard"); setIsOpen(false); }}><FaHome /> الرئيسية</button></li>
                    <li><button onClick={() => { navigate("community"); setIsOpen(false); }}><FaComments /> المنتدى</button></li>
                    <li><button onClick={() => { navigate("news"); setIsOpen(false); }}><FaNewspaper /> أخبار وصور</button></li>
                    <li><button onClick={() => { navigate("community/jobs"); setIsOpen(false); }}><FaBriefcase /> وظائف شاغرة</button></li>
                    <li><button onClick={() => { navigate("GraduationBook"); setIsOpen(false); }}><FaBook /> طلب كتاب التخرج</button></li>
                    <li><button onClick={() => { navigate("community/success-stories"); setIsOpen(false); }}><FaStar /> قصص نجاح</button></li>
                    {user?.role === 'admin' && (
                        <li><button onClick={() => { navigate("admin/articles"); setIsOpen(false); }}><FaImage /> إدارة المقالات</button></li>
                    )}
                    <li><button onClick={() => { navigate("ProfilePage"); setIsOpen(false); }}><FaUser /> إعدادات المستخدم</button></li>
                    <li><button onClick={handleLogout}><FaSignOutAlt /> تسجيل الخروج</button></li>
                </ul>
            </div>

            {isMobile && isOpen && (
                <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />
            )}
        </>
    );
};

export default NavigationBar;