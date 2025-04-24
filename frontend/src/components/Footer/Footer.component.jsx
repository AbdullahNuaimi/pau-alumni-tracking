import './Footer.css';


const Footer = () => {
    if (!localStorage.getItem("user")) return null;
    return (
        <div className="copyright">
            <p>© {new Date().getFullYear()} نظام متابعة الخريجين - جامعة فلسطين الأهلية. جميع الحقوق محفوظة.</p>
        </div>

    );
};

export default Footer;