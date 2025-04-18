import { useState, useEffect } from 'react';
import './profilePage.css';
import { useUser } from '../../contexts/UserContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import ar from 'date-fns/locale/ar';

registerLocale('ar', ar);

const ProfilePage = () => {
    const { user, setUser } = useUser();
    const [initialUser, setInitialUser] = useState(user);
    const [editMode, setEditMode] = useState(false);
    const [dateRanges, setDateRanges] = useState(() => {
        const ranges = {};
        user.career?.forEach((job, index) => {
            if (job.duration) {
                const parts = job.duration.split(' - ');
                try {
                    const parsedStart = parts[0] ? new Date(parts[0]) : null;
                    const parsedEnd = parts[1] ? new Date(parts[1]) : null;

                    if (!isNaN(parsedStart?.getTime())) {
                        ranges[index] = [parsedStart, parsedEnd];
                    }
                } catch (e) {
                    console.warn("Failed to parse dates:", e);
                }
            }
        });
        return ranges;
    });
    const parseDateString = (dateStr) => {
        if (!dateStr || dateStr === 'الحاضر') return null;

        // Handle different date string formats
        if (dateStr.includes('/')) {
            return new Date(dateStr);
        }

        // Handle Arabic date strings if needed
        if (dateStr.includes('-')) {
            const parts = dateStr.split('-').map(part => part.trim());
            return new Date(parts[0]);
        }

        return null;
    };

    // Initialize date ranges for career items
    useEffect(() => {
        if (user.career?.length > 0) {
            const ranges = {};
            user.career.forEach((job, index) => {
                if (job.duration) {
                    const parts = job.duration.split(' - ');
                    ranges[index] = [
                        parseDateString(parts[0]),
                        parseDateString(parts[1])
                    ];
                }
            });
            setDateRanges(ranges);
        }
    }, [user.career, editMode]);

    useEffect(() => {
        if (!user.socialMedia) {
            setUser(prev => ({ ...prev, socialMedia: [] }));
        }
    }, [user.socialMedia]);

    const formatDate = (date) => {
        if (!date || !(date instanceof Date)) return 'الحاضر';

        try {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}/${month}/${day}`;
        } catch (e) {
            console.error('Date formatting error:', e);
            return 'الحاضر';
        }
    };

    const handleDateChange = (update, index) => {
        const [start, end] = update;

        // Validate dates
        const isValidStart = start && !isNaN(start.getTime());
        const isValidEnd = end && !isNaN(end.getTime());

        setDateRanges(prev => ({
            ...prev,
            [index]: [
                isValidStart ? start : null,
                isValidEnd ? end : null
            ]
        }));

        const newDuration = `${isValidStart ? formatDate(start) : ''} - ${isValidEnd ? formatDate(end) : 'الحاضر'}`;

        handleCareerChange({
            target: {
                name: 'duration',
                value: newDuration
            }
        }, index);
    };

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

    const handleResumeChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUser(prev => ({ ...prev, resume: { file, url: reader.result } }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEducationChange = (e, index) => {
        const { name, value } = e.target;
        setUser(prev => {
            const updatedEducation = [...prev.education];
            updatedEducation[index] = {
                ...updatedEducation[index],
                [name]: value
            };
            return { ...prev, education: updatedEducation };
        });
    };

    const handleCareerChange = (e, index) => {
        const { name, value, type, checked } = e.target;
        setUser(prev => {
            const updatedCareer = [...prev.career];
            updatedCareer[index] = {
                ...updatedCareer[index],
                [name]: type === 'checkbox' ? checked : value
            };
            return { ...prev, career: updatedCareer };
        });
    };

    const addEducation = () => {
        setUser(prev => ({
            ...prev,
            education: [
                ...prev.education,
                { college: '', major: '', degree: 'بكالوريوس' }
            ]
        }));
    };

    const removeEducation = (index) => {
        setUser(prev => ({
            ...prev,
            education: prev.education.filter((_, i) => i !== index)
        }));
    };

    const addCareer = () => {
        setUser(prev => ({
            ...prev,
            career: [
                ...prev.career,
                { company: '', title: '', duration: '', employed: true }
            ]
        }));
    };

    const removeCareer = (index) => {
        setUser(prev => ({
            ...prev,
            career: prev.career.filter((_, i) => i !== index)
        }));
    };

    const handleSocialMediaChange = (e, index, field) => {
        setUser(prev => ({
            ...prev,
            socialMedia: (prev.socialMedia || []).map((item, i) =>
                i === index ? { ...item, [field]: e.target.value } : item
            )
        }));
    };

    const addSocialMedia = () => {
        setUser(prev => ({
            ...prev,
            socialMedia: [...(prev.socialMedia || []), { label: '', url: '' }]
        }));
    };

    const removeSocialMedia = (index) => {
        setUser(prev => ({
            ...prev,
            socialMedia: (prev.socialMedia || []).filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // data to backend
        console.log('Updated user data:', user);
        setInitialUser(user);
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

                    <div className="form-group">
                        <label>رقم الجوال:</label>
                        {editMode ? (
                            <input
                                type="tel"
                                name="phone"
                                value={user.phone || ''}
                                onChange={handleChange}
                                placeholder="+966XXXXXXXXX"
                            />
                        ) : (
                            <p>{user.phone || 'غير متوفر'}</p>
                        )}
                    </div>

                    {editMode && (
                        <div className="form-group">
                            <label>السيرة الذاتية:</label>
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={handleResumeChange}
                            />
                            {user.resume && (
                                <span>تم تحميل الملف: {user.resume.file.name}</span>
                            )}
                        </div>
                    )}

                    {!editMode && user.resume && (
                        <div className="form-group">
                            <label>السيرة الذاتية:</label>
                            <a href={user.resume.url} download target="_blank" rel="noopener noreferrer">
                                عرض السيرة الذاتية
                            </a>
                        </div>
                    )}

                    {editMode && (
                        <div className="form-group">
                            <label>كلمة المرور الجديدة:</label>
                            <input
                                type="password"
                                name="password"
                                value={user.password || ''}
                                onChange={handleChange}
                                placeholder="اتركها فارغة إذا لم ترغب في التغيير"
                            />
                        </div>
                    )}
                </div>

                <div className="section">
                    <h3>وسائل التواصل الاجتماعي</h3>

                    {(user.socialMedia || []).length > 0 ? (
                        (user.socialMedia || []).map((social, index) => (
                            <div key={index} className="social-media-entry">
                                {editMode && (
                                    <button
                                        type="button"
                                        className="remove-btn"
                                        onClick={() => removeSocialMedia(index)}
                                    >
                                        حذف
                                    </button>
                                )}

                                <div className="form-group">
                                    {editMode ? (
                                        <input
                                            type="text"
                                            value={social.label}
                                            onChange={(e) => handleSocialMediaChange(e, index, 'label')}
                                            placeholder="مثال: LinkedIn"
                                        />
                                    ) : (
                                        <></>
                                    )}
                                </div>

                                <div className="form-group">
                                    {editMode ? (
                                        <input
                                            type="url"
                                            value={social.url}
                                            onChange={(e) => handleSocialMediaChange(e, index, 'url')}
                                            placeholder="https://example.com/username"
                                        />
                                    ) : (
                                        <a href={social.url} target="_blank" rel="noopener noreferrer">
                                            {social.label}
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        !editMode && <p>لا توجد وسائل تواصل مضافة</p>
                    )}

                    {editMode && (
                        <button
                            type="button"
                            className="add-btn"
                            onClick={addSocialMedia}
                        >
                            إضافة وسيلة تواصل
                        </button>
                    )}
                </div>
                <div className="section">
                    <h3>المعلومات التعليمية</h3>
                    {user.education?.map((edu, index) => (
                        <div key={index} className="education-entry">
                            {editMode && index > 0 && (
                                <button
                                    type="button"
                                    className="remove-btn"
                                    onClick={() => removeEducation(index)}
                                >
                                    حذف
                                </button>
                            )}
                            <div className="form-group">
                                <label>الكلية:</label>
                                {editMode ? (
                                    <input
                                        type="text"
                                        name="college"
                                        value={edu.college}
                                        onChange={(e) => handleEducationChange(e, index)}
                                    />
                                ) : (
                                    <p>{edu.college}</p>
                                )}
                            </div>

                            <div className="form-group">
                                <label>التخصص:</label>
                                {editMode ? (
                                    <input
                                        type="text"
                                        name="major"
                                        value={edu.major}
                                        onChange={(e) => handleEducationChange(e, index)}
                                    />
                                ) : (
                                    <p>{edu.major}</p>
                                )}
                            </div>

                            <div className="form-group">
                                <label>الدرجة العلمية:</label>
                                {editMode ? (
                                    <select
                                        name="degree"
                                        value={edu.degree}
                                        onChange={(e) => handleEducationChange(e, index)}
                                    >
                                        <option value="بكالوريوس">بكالوريوس</option>
                                        <option value="ماجستير">ماجستير</option>
                                        <option value="دكتوراه">دكتوراه</option>
                                    </select>
                                ) : (
                                    <p>{edu.degree}</p>
                                )}
                            </div>
                        </div>
                    ))}

                    {editMode && (
                        <button
                            type="button"
                            className="add-btn"
                            onClick={addEducation}
                        >
                            إضافة مؤهل تعليمي
                        </button>
                    )}
                </div>

                <div className="section">
                    <h3>المعلومات المهنية</h3>
                    {user.career?.map((job, index) => (
                        <div key={index} className="career-entry">
                            {editMode && (
                                <div className="form-group">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            name="employed"
                                            checked={job.employed}
                                            onChange={(e) => handleCareerChange(e, index)}
                                        />
                                        موظف حالياً
                                    </label>
                                </div>
                            )}

                            {(!editMode || job.employed) && (
                                <>
                                    {editMode && index > 0 && (
                                        <button
                                            type="button"
                                            className="remove-btn"
                                            onClick={() => removeCareer(index)}
                                        >
                                            حذف
                                        </button>
                                    )}

                                    <div className="form-group">
                                        <label>اسم الشركة:</label>
                                        {editMode ? (
                                            <input
                                                type="text"
                                                name="company"
                                                value={job.company}
                                                onChange={(e) => handleCareerChange(e, index)}
                                            />
                                        ) : (
                                            <p>{job.company}</p>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label>المسمى الوظيفي:</label>
                                        {editMode ? (
                                            <input
                                                type="text"
                                                name="title"
                                                value={job.title}
                                                onChange={(e) => handleCareerChange(e, index)}
                                            />
                                        ) : (
                                            <p>{job.title}</p>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label>المدة:</label>
                                        {editMode ? (
                                            <div className="date-picker-wrapper">
                                                <DatePicker
                                                    selectsRange
                                                    startDate={dateRanges[index]?.[0] || null}
                                                    endDate={dateRanges[index]?.[1] || null}
                                                    onChange={(update) => handleDateChange(update, index)}
                                                    locale="ar"
                                                    dateFormat="yyyy/MM/dd"
                                                    placeholderText="اختر الفترة الزمنية"
                                                    className="arabic-date-picker"
                                                    isClearable
                                                    withPortal
                                                    peekNextMonth
                                                    showMonthDropdown
                                                    showYearDropdown
                                                    dropdownMode="select"
                                                    selected={null} // Important to prevent selection issues
                                                />
                                            </div>
                                        ) : (
                                            <p>{job.duration || 'غير محدد'}</p>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    ))}

                    {editMode && (
                        <button
                            type="button"
                            className="add-btn"
                            onClick={addCareer}
                        >
                            إضافة وظيفة
                        </button>
                    )}
                </div>

                <div className="actions">
                    {editMode && (
                        <>
                            <button type="submit" className="save-btn">حفظ التغييرات</button>
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={handleCancel}
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