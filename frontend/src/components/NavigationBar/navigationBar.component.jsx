import "./navigationBar.css"
import logo from "../../assets/navigation_bar_logo.png";
import { useLocation } from "react-router"
const NavigationBar = () => {
    let location = useLocation();
    return (
        <div className={location.pathname == "/" || location.pathname == "/register"? 'hidden': ''} >
            <div className="sidebar">
        <div className="logo">
            <img src={logo} alt="شعار الجامعة" />
            <h2>موقع الخريجين</h2>
        </div>
        <ul>
            <li><a href="dashboard"><i className="fa fa-home"></i> الرئيسية</a></li>
            <li><a href="community"><i className="fa fa-comments"></i> المنتدى</a></li>
            <li><a href="community"><i className="fa fa-briefcase"></i> وظائف شاغرة</a></li>
            <li><a href="GraduationBook"><i className="fa fa-book"></i> طلب كتاب التخرج</a></li>
            <li><a href="community"><i className="fa fa-star"></i> قصص نجاح</a></li>
            <li><a href="Profile"><i className="fa fa-user"></i> إعدادات المستخدم</a></li>
            <li><a href="/"><i className="fa fa-sign-out-alt"></i> تسجيل الخروج</a></li>
        </ul>
    </div>
        </div>
    );
};

export default NavigationBar;