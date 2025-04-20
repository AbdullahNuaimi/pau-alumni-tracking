import './editUserInfo.css';
import { useUser } from '../../contexts/UserContext';
import { useState, useEffect } from 'react';
import { toast, Bounce } from 'react-toastify';
import axios from 'axios';

const EditUserInfo = () => {
    const { user, setUser } = useUser();
    const [editMode, setEditMode] = useState(true);
    const [editedUser, setEditedUser] = useState({...user});
    const [socialMediaLink, setSocialMediaLink] = useState('');
    const [socialMediaLabel, setSocialMediaLabel] = useState('');
    
    useEffect(() => {
        setEditedUser({...user});
    }, [user]);

    const validateEmail = (input) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
    const validatePhone = (input) => /^(?:\+970|00970|970|0)(?:5[0-9])\d{7}$/.test(input);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            if (!validateEmail(editedUser.email)) {
                toast.error('صيغة الايميل غير صحيحة', { transition: Bounce });
                return;
            }

            if (editedUser.phone && !validatePhone(editedUser.phone)) {
                toast.error('صيغة رقم الجوال غير صحيحة', { transition: Bounce });
                return;
            }

            const response = await axios.put(
                'http://localhost:5000/api/v1/auth/updateInfo',
                {
                    id: editedUser._id,
                    name: editedUser.name,
                    email: editedUser.email,
                    phone: editedUser.phone,
                    socialMedia: editedUser.socialMedia || []
                },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (response.data.success) {
                setUser(response.data.data);
                localStorage.setItem('user', JSON.stringify(response.data.data));
                setEditMode(true);
                toast.success('تم تحديث البيانات بنجاح', { transition: Bounce });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'حدث خطأ أثناء التحديث', { transition: Bounce });
        }
    };

    const addSocialMedia = () => {
        if (!socialMediaLabel.trim() || !socialMediaLink.trim()) {
            toast.error('الرجاء إدخال جميع الحقول', { transition: Bounce });
            return;
        }

        setEditedUser(prev => ({
            ...prev,
            socialMedia: [
                ...(prev.socialMedia || []),
                { 
                    label: socialMediaLabel.trim(),
                    link: socialMediaLink.trim().startsWith('http') ? 
                          socialMediaLink.trim() : 
                          `https://${socialMediaLink.trim()}`
                }
            ]
        }));

        setSocialMediaLabel('');
        setSocialMediaLink('');
    };

    const handleDeleteSocial = (index) => {
        setEditedUser(prev => {
            const updatedSocialMedia = [...(prev.socialMedia || [])];
            updatedSocialMedia.splice(index, 1);
            return { ...prev, socialMedia: updatedSocialMedia };
        });
    };

    return (
        <div className='edit-user-profile'>
            <div className="profile-header">
                <h2>المعلومات الشخصية</h2>
                <button 
                    className={`edit-toggle-btn ${editMode ? '' : 'cancel'}`}
                    onClick={() => setEditMode(!editMode)}
                >
                    {editMode ? 'تعديل الملف' : 'إلغاء التعديل'}
                </button>
            </div>

            <div className="profile-form">
                <div className="form-group">
                    <label>الاسم الكامل</label>
                    <input 
                        type="text" 
                        name='name' 
                        disabled={editMode} 
                        value={editedUser.name || ''} 
                        onChange={handleChange} 
                    />
                </div>

                <div className="form-group">
                    <label>البريد الإلكتروني</label>
                    <input 
                        type="text" 
                        name='email' 
                        disabled={editMode} 
                        value={editedUser.email || ''} 
                        onChange={handleChange} 
                    />
                </div>

                <div className="form-group">
                    <label>رقم الجوال</label>
                    <input 
                        type="text" 
                        name='phone' 
                        disabled={editMode} 
                        value={editedUser.phone || ''} 
                        onChange={handleChange} 
                        placeholder="059XXXXXXX"
                    />
                </div>

                {!editMode && (
                    <>
                        <div className="social-media-section">
                            <h3>وسائل التواصل الاجتماعي</h3>
                            <div className="social-input-group">
                                <input 
                                    type="text" 
                                    placeholder="مثال: لينكد إن" 
                                    value={socialMediaLabel} 
                                    onChange={e => setSocialMediaLabel(e.target.value)} 
                                />
                                <input 
                                    type="text" 
                                    placeholder="رابط الحساب" 
                                    value={socialMediaLink} 
                                    onChange={e => setSocialMediaLink(e.target.value)} 
                                />
                                <button 
                                    className="add-social-btn"
                                    onClick={addSocialMedia}
                                >
                                    إضافة
                                </button>
                            </div>

                            {editedUser.socialMedia?.length > 0 && (
                                <div className="social-links-list">
                                    {editedUser.socialMedia.map((social, index) => (
                                        <div key={index} className="social-link-item">
                                            <span className="social-label">{social.label}</span>
                                            <a 
                                                href={social.link} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="social-link"
                                            >
                                                {social.link}
                                            </a>
                                            <button 
                                                className="delete-social-btn"
                                                onClick={() => handleDeleteSocial(index)}
                                            >
                                                حذف
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="form-actions">
                            <button 
                                className="save-btn"
                                onClick={handleSave}
                            >
                                حفظ التغييرات
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default EditUserInfo;