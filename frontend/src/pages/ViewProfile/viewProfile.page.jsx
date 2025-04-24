import "./viewProfile.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaLinkedin, FaTwitter, FaGithub, FaGlobe, FaEnvelope, FaPhone, FaUniversity, FaGraduationCap, FaBriefcase, FaCalendarAlt } from "react-icons/fa";

const ViewProfile = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`/api/v1/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setUser(response.data.data.user);
            } catch (error) {
                console.error('Error fetching user profile:', error);
                toast.error('حدث خطأ أثناء جلب بيانات المستخدم');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [userId]);

    if (loading) {
        return <div className="loading">جاري التحميل...</div>;
    }

    if (!user) {
        return <div className="error">لا يمكن العثور على المستخدم</div>;
    }

    return (
        <div className="view-profile-container">
            <div className="profile-header">
                <div className="profile-image-container">
                    <img 
                        src={user.profilePic} 
                        alt={user.name} 
                        className="profile-image"
                        onError={(e) => {
                            e.target.src = '/default-avatar.png';
                        }}
                    />
                </div>
                <div className="profile-info">
                    <h1 className="profile-name">{user.name}</h1>
                    <p className="profile-email">
                        <FaEnvelope className="icon" /> {user.email}
                    </p>
                    {user.phone && (
                        <p className="profile-phone">
                            <FaPhone className="icon" /> {user.phone}
                        </p>
                    )}
                    <p className="profile-university">
                        <FaUniversity className="icon" /> الرقم الجامعي: {user.universityId}
                    </p>
                </div>
            </div>

            <div className="profile-sections">
                {user.socialMedia?.length > 0 && (
                    <section className="profile-section">
                        <h2 className="section-title">
                            <FaGlobe className="icon" /> وسائل التواصل
                        </h2>
                        <div className="social-links">
                            {user.socialMedia.map((social, index) => (
                                <a 
                                    key={index} 
                                    href={social.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="social-link"
                                >
                                    {getSocialIcon(social.label)} {social.label}
                                </a>
                            ))}
                        </div>
                    </section>
                )}

                {user.education?.length > 0 && (
                    <section className="profile-section">
                        <h2 className="section-title">
                            <FaGraduationCap className="icon" /> التعليم
                        </h2>
                        {user.education.map((edu, index) => (
                            <div key={index} className="education-item">
                                <h3>{edu.university}</h3>
                                <p>{edu.college} - {edu.major}</p>
                                <p>{edu.degree} {edu.year && `(${edu.year})`}</p>
                            </div>
                        ))}
                    </section>
                )}

                {user.career?.length > 0 && (
                    <section className="profile-section">
                        <h2 className="section-title">
                            <FaBriefcase className="icon" /> الخبرة المهنية
                        </h2>
                        {user.career.map((job, index) => (
                            <div key={index} className="career-item">
                                <h3>{job.position}</h3>
                                <p>{job.company}</p>
                                <p className="date-range">
                                    <FaCalendarAlt className="icon" />
                                    {formatDate(job.startDate)} - {job.currentlyWorking ? 'الحاضر' : formatDate(job.endDate)}
                                </p>
                            </div>
                        ))}
                    </section>
                )}
            </div>
        </div>
    );
};

const getSocialIcon = (label) => {
    switch(label.toLowerCase()) {
        case 'linkedin': return <FaLinkedin />;
        case 'twitter': return <FaTwitter />;
        case 'github': return <FaGithub />;
        default: return <FaGlobe />;
    }
};

const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG');
};

export default ViewProfile; 