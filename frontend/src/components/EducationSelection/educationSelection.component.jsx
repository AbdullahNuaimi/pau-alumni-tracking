import React, { useState } from 'react';
import { universitiesList } from '../../assets/universities';
import './educationSelection.css';
import { useUser } from '../../contexts/UserContext';
import { toast, Bounce } from 'react-toastify';

const EducationSelection = () => {
    const { user, setUser } = useUser();
    const [selectedUniversity, setSelectedUniversity] = useState('');
    const [selectedCollege, setSelectedCollege] = useState('');
    const [selectedMajor, setSelectedMajor] = useState('');
    const [selectedDegree, setSelectedDegree] = useState('');

    const getColleges = () => {
        const uni = universitiesList.find(u => u.university === selectedUniversity);
        return uni ? uni.colleges : [];
    };

    const getMajors = () => {
        const colleges = getColleges();
        const college = colleges.find(c => c.name === selectedCollege);
        return college ? college.majors : [];
    };

    const getDegrees = () => {
        const colleges = getColleges();
        const college = colleges.find(c => c.name === selectedCollege);
        return college ? college.degrees : [];
    };

    const handleUniversityChange = (e) => {
        setSelectedUniversity(e.target.value);
        setSelectedCollege('');
        setSelectedMajor('');
        setSelectedDegree('');
    };

    const handleCollegeChange = (e) => {
        setSelectedCollege(e.target.value);
        setSelectedMajor('');
        setSelectedDegree('');
    };

    const handleMajorChange = (e) => {
        setSelectedMajor(e.target.value);
    };

    const handleDegreeChange = (e) => {
        setSelectedDegree(e.target.value);
    };

    const updateUserEducation = () => {
        return new Promise((resolve, reject) => {
            try {
                setUser(prevUser => {
                    const newEducation = {
                        university: selectedUniversity,
                        college: selectedCollege,
                        major: selectedMajor,
                        degree: selectedDegree
                    };
                    
                    const educationExists = prevUser.education.some(edu =>
                        edu.university === newEducation.university &&
                        edu.college === newEducation.college &&
                        edu.major === newEducation.major &&
                        edu.degree === newEducation.degree
                    );
            
                    if (educationExists) {
                        throw new Error('هذه المؤهل الدراسي مسجل مسبقاً');
                    }
            
                    const updatedUser = {
                        ...prevUser,
                        education: [...prevUser.education, newEducation]
                    };
            
                    resolve(updatedUser);
                    return updatedUser;
                });
            } catch (error) {
                reject(error);
            }
        });
    };

    const handleEducationEntry = async () => {
        if (!selectedUniversity || !selectedCollege || !selectedMajor || !selectedDegree) {
            toast.error('الرجاء إكمال جميع الحقول', { transition: Bounce });
            return;
        }

        try {
            const updatedUser = await updateUserEducation();
            localStorage.setItem("user", JSON.stringify(updatedUser));

            const response = await fetch("http://localhost:5000/api/v1/auth/updateEducation", {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    id: updatedUser._id, 
                    education: [...updatedUser.education]
                })
            });

            if (response.status === 200) {
                toast.success("تم تحديث الوضع الأكاديمي بنجاح", { 
                    position: "top-right",
                    transition: Bounce
                });
                // Clear selections after successful save
                setSelectedUniversity('');
                setSelectedCollege('');
                setSelectedMajor('');
                setSelectedDegree('');
            }
        } catch (error) {
            toast.error(error.message || 'حدث خطأ أثناء التحديث', { 
                transition: Bounce 
            });
        }
    };

    const handleDeleteEntry = (index) => async() => {
        const updatedEducation = [...user.education];
        updatedEducation.splice(index, 1);
        
        const updatedUser = {
            ...user,
            education: updatedEducation
        };
        
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        try {
            const response = await fetch("http://localhost:5000/api/v1/auth/updateEducation", {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    id: updatedUser._id, 
                    education: updatedEducation
                })
            });
            
            if (response.status === 200) {
                toast.success("تم حذف المؤهل الدراسي", { 
                    position: "top-right",
                    transition: Bounce
                });
            }
        } catch (error) {
            toast.error('حدث خطأ أثناء الحذف', { 
                transition: Bounce 
            });
        }
    };

    return (
        <div className="education-selection">
            <div className="selection-header">
                <h3>المعلومات الأكاديمية</h3>
            </div>

            <div className="selection-form">
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="university">الجامعة</label>
                        <select
                            id="university"
                            value={selectedUniversity}
                            onChange={handleUniversityChange}
                        >
                            <option value="">اختر الجامعة</option>
                            {universitiesList.map((uni, index) => (
                                <option key={index} value={uni.university}>
                                    {uni.university}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="college">الكلية</label>
                        <select
                            id="college"
                            value={selectedCollege}
                            onChange={handleCollegeChange}
                            disabled={!selectedUniversity}
                        >
                            <option value="">اختر الكلية</option>
                            {getColleges().map((college, index) => (
                                <option key={index} value={college.name}>
                                    {college.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="major">التخصص</label>
                        <select
                            id="major"
                            value={selectedMajor}
                            onChange={handleMajorChange}
                            disabled={!selectedCollege}
                        >
                            <option value="">اختر التخصص</option>
                            {getMajors().map((major, index) => (
                                <option key={index} value={major}>
                                    {major}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="degree">الدرجة العلمية</label>
                        <select
                            id="degree"
                            value={selectedDegree}
                            onChange={handleDegreeChange}
                            disabled={!selectedCollege}
                        >
                            <option value="">اختر الدرجة العلمية</option>
                            {getDegrees().map((degree, index) => (
                                <option key={index} value={degree}>
                                    {degree}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-actions">
                    <button 
                        type="button" 
                        className="save-btn"
                        onClick={handleEducationEntry}
                        disabled={!selectedUniversity || !selectedCollege || !selectedMajor || !selectedDegree}
                    >
                        حفظ المعلومات
                    </button>
                </div>
            </div>

            {user.education && user.education.length > 0 && (
                <div className="education-list">
                    <h4>المؤهلات المسجلة:</h4>
                    <ul>
                        {user.education.map((edu, index) => (
                            <li key={index} className="education-item">
                                <div className="education-details">
                                    <span className="degree">{edu.degree}</span>
                                    <span className="major">{edu.major}</span>
                                    <span className="college">{edu.college}</span>
                                    <span className="university">{edu.university}</span>
                                </div>
                                <button
                                    className="delete-btn"
                                    onClick={handleDeleteEntry(index)}
                                >
                                    حذف
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default EducationSelection;