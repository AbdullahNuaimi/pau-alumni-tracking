import { useState } from 'react';
import './profilePage.css'; // RTL stylesheet
import { useUser } from '../../contexts/UserContext';

const ProfilePage = () => {
    const { user, setUser } = useUser(); // Get user data from context
    const [initialUser,setinitialUser] = useState(user);
    const [editMode, setEditMode] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setUser(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: type === 'checkbox' ? checked : value
                }
            }));
        } else {
            setUser(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUser(prev => ({ ...prev, profilePic: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send data to backend
        console.log('Updated user data:', user);
        setEditMode(false);
    };
    const handleCancel = () => {
        setUser(initialUser);
        setEditMode(false);
    }
    return (
        <div className="profile-container">
            <h1>الملف الشخصي</h1>

            <div className="profile-header">
                <div className="profile-pic">
                    <img
                        src={user.profilePic || '/default-avatar.png'}
                        alt="صورة الملف الشخصي"
                    />
                    {editMode && (
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    )}
                </div>
                <h2>{user.name}</h2>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="section">
                    <h3>المعلومات الشخصية</h3>
                    <div className="form-group">
                        <label>الاسم الكامل:</label>
                        {editMode ? (
                            <input
                                type="text"
                                name="name"
                                value={user.name}
                                onChange={handleChange}
                            />
                        ) : (
                            <p>{user.name}</p>
                        )}
                    </div>

                    <div className="form-group">
                        <label>البريد الإلكتروني:</label>
                        {editMode ? (
                            <input
                                type="email"
                                name="email"
                                value={user.email}
                                onChange={handleChange}
                            />
                        ) : (
                            <p>{user.email}</p>
                        )}
                    </div>

                    {editMode && (
                        <div className="form-group">
                            <label>كلمة المرور الجديدة:</label>
                            <input
                                type="password"
                                name="password"
                                value={user.password}
                                onChange={handleChange}
                                placeholder="اتركها فارغة إذا لم ترغب في التغيير"
                            />
                        </div>
                    )}
                </div>

                <div className="section">
                    <h3>المعلومات التعليمية</h3>
                    <div className="form-group">
                        <label>الكلية:</label>
                        {editMode ? (
                            <input
                                type="text"
                                name="education.college"
                                value={user.education.college}
                                onChange={handleChange}
                            />
                        ) : (
                            <p>{user.education.college}</p>
                        )}
                    </div>

                    <div className="form-group">
                        <label>التخصص:</label>
                        {editMode ? (
                            <input
                                type="text"
                                name="education.major"
                                value={user.education.major}
                                onChange={handleChange}
                            />
                        ) : (
                            <p>{user.education.major}</p>
                        )}
                    </div>

                    <div className="form-group">
                        <label>الدرجة العلمية:</label>
                        {editMode ? (
                            <select
                                name="education.degree"
                                value={user.education.degree}
                                onChange={handleChange}
                            >
                                <option value="بكالوريوس">بكالوريوس</option>
                                <option value="ماجستير">ماجستير</option>
                                <option value="دكتوراه">دكتوراه</option>
                            </select>
                        ) : (
                            <p>{user.education.degree}</p>
                        )}
                    </div>
                </div>

                <div className="section">
                    <h3>المعلومات المهنية</h3>
                    <div className="form-group">
                        <label>حالة التوظيف:</label>
                        {editMode ? (
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="career.employed"
                                    checked={user.career.employed}
                                    onChange={handleChange}
                                />
                                موظف حالياً
                            </label>
                        ) : (
                            <p>{user.career.employed ? 'موظف' : 'غير موظف'}</p>
                        )}
                    </div>

                    {user.career.employed && (
                        <>
                            <div className="form-group">
                                <label>اسم الشركة:</label>
                                {editMode ? (
                                    <input
                                        type="text"
                                        name="career.company"
                                        value={user.career.company}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <p>{user.career.company}</p>
                                )}
                            </div>

                            <div className="form-group">
                                <label>المسمى الوظيفي:</label>
                                {editMode ? (
                                    <input
                                        type="text"
                                        name="career.title"
                                        value={user.career.title}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <p>{user.career.title}</p>
                                )}
                            </div>

                            <div className="form-group">
                                <label>المدة:</label>
                                {editMode ? (
                                    <input
                                        type="text"
                                        name="career.duration"
                                        value={user.career.duration}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <p>{user.career.duration}</p>
                                )}
                            </div>
                        </>
                    )}
                </div>

                <div className="actions">
                    {editMode && (
                        <>
                            <button type="submit" className="save-btn" >حفظ التغييرات</button>
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => { handleCancel()}} 
                            >
                                إلغاء
                            </button>
                        </>
                    )}
                </div>
            </form>
            {!editMode && (
                <button
                    type="button"
                    className="edit-btn"
                    onClick={() => setEditMode(true)}
                >
                    تعديل الملف الشخصي
                </button>
            )}
        </div>
    );
};

export default ProfilePage;