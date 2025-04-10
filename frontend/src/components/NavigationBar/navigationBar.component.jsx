import "./navigationBar.css"
import logo from "../../assets/navigation_bar_logo.png";
import { useLocation, useNavigate } from "react-router"
import { logout } from "../../services/authService";
import { useUser } from "../../contexts/UserContext";

const NavigationBar = () => {
    let location = useLocation();
    let navigate = useNavigate();
    const { setUser } = useUser();
    const handleLogout = async () => {
        const result = await logout(true);
        if (result.success) {
            setUser(null);
            navigate("/");
        }
    }
    return (
        <div className={location.pathname == "/" || location.pathname == "/register"? 'hidden': ''} >
            <div className="sidebar">
        <div className="logo">
            <img src={logo} alt="شعار الجامعة" />
            <h2>موقع الخريجين</h2>
        </div>
        <ul>
            <li><a onClick={()=>navigate("dashboard")}><i className="fa fa-home"></i> الرئيسية</a></li>
            <li><a onClick={()=>navigate("community")} ><i className="fa fa-comments"></i> المنتدى</a></li>
            <li><a onClick={()=>navigate("community/jobs")}><i className="fa fa-briefcase"></i> وظائف شاغرة</a></li>
            <li><a onClick={()=> navigate("GraduationBook")}><i className="fa fa-book"></i> طلب كتاب التخرج</a></li>
            <li><a onClick={()=>navigate("community/success-stories")}><i className="fa fa-star"></i> قصص نجاح</a></li>
            <li><a onClick={()=>navigate("ProfilePage")}><i className="fa fa-user"></i> إعدادات المستخدم</a></li>
            <li><a onClick={()=> {handleLogout()}}><i className="fa fa-sign-out-alt"></i> تسجيل الخروج</a></li>
        </ul>
    </div>
        </div>
    );
};

export default NavigationBar;