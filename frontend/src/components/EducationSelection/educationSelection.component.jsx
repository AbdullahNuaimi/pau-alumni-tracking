import React, { useState } from 'react';
import { universitiesList } from '../../assets/universities';
import './educationSelection.css'; // Import your CSS file for styling
import { useUser } from '../../contexts/UserContext';
import { toast, Slide } from 'react-toastify';
const UniversityDropdowns = () => {
    const { user, setUser } = useUser();
    // State to track selections
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
    };

    const handleCollegeChange = (e) => {
        setSelectedCollege(e.target.value);
        setSelectedMajor('');
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
              
              // Check for duplicate education
              const educationExists = prevUser.education.some(edu =>
                edu.university === newEducation.university &&
                edu.college === newEducation.college &&
                edu.major === newEducation.major &&
                edu.degree === newEducation.degree
              );
      
              if (educationExists) {
                throw new Error('This education already exists!');
              }
      
              const updatedUser = {
                ...prevUser,
                education: [...prevUser.education, newEducation]
              };
      
              resolve(updatedUser); // Resolve with the new state
              return updatedUser;
            });
          } catch (error) {
            reject(error); // Reject if there's an error
          }
        });
      };

    const handleEducationEntry = async () => {
         const updatedUser = await updateUserEducation();

        console.log("updated user", user);
        localStorage.setItem("user", JSON.stringify(updatedUser));

        const response = await fetch("http://localhost:5000/api/v1/auth/updateEducation", {
            method: "POST",
            headers: {
                "content-type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                id: updatedUser._id, education: [...updatedUser.education]
            })
        });
        if(response.status===200){
            toast("تم تعديل الوضع الاكاديمي", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Slide,
                });
        }

        // Submit to API or perform other actions
    };
    const handleDeleteEntry = (index) => async() => {
        const updatedEducation = [...user.education];
        updatedEducation.splice(index, 1);
        setUser(() => ({
            ...user,
            education: updatedEducation
        }));
        const updatedUser = {
            ...user,
            education: updatedEducation
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        const response = await fetch("http://localhost:5000/api/v1/auth/updateEducation", {
            method: "POST",
            headers: {
                "content-type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                id: updatedUser._id, education: [...updatedUser.education]
            })
        });
        if(response.status===200){
            toast("تم تعديل الوضع الاكاديمي", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Slide,
                });
        }
    }
    return (
        <div className="university-dropdowns">

            <div className="dropdown">
                <label htmlFor="university">University</label>
                <select
                    id="university"
                    value={selectedUniversity}
                    onChange={handleUniversityChange}
                >
                    <option value="">Select a University</option>
                    {universitiesList.map((uni, index) => (
                        <option key={index} value={uni.university}>
                            {uni.university}
                        </option>
                    ))}
                </select>
            </div>

            <div className="dropdown">
                <label htmlFor="college">College</label>
                <select
                    id="college"
                    value={selectedCollege}
                    onChange={handleCollegeChange}
                    disabled={!selectedUniversity}
                >
                    <option value="">Select a College</option>
                    {getColleges().map((college, index) => (
                        <option key={index} value={college.name}>
                            {college.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="dropdown">
                <label htmlFor="major">Major:</label>
                <select
                    id="major"
                    value={selectedMajor}
                    onChange={handleMajorChange}
                    disabled={!selectedCollege}
                >
                    <option value="">Select a Major</option>
                    {getMajors().map((major, index) => (
                        <option key={index} value={major}>
                            {major}
                        </option>
                    ))}
                </select>
            </div>
            <div className="dropdown">
                <label htmlFor="degree">Degree</label>
                <select
                    id="degree"
                    value={selectedDegree}
                    onChange={handleDegreeChange}
                    disabled={!selectedCollege}
                >
                    <option value="">Select a Degree</option>
                    {getDegrees().map((degree, index) => (
                        <option key={index} value={degree}>
                            {degree}
                        </option>
                    ))}
                </select>
            </div>
            <button type="button" onClick={handleEducationEntry}>حفظ</button>
            {user.education && user.education.length > 0 && (
                <div className="education-list">
                    <ul>
                        {user.education.map((edu, index) => (
                            <li key={index}>
                                <label className='edu-select-delete-entry-btn'><span onClick={handleDeleteEntry(index)} >❌</span></label>
                                {edu.major}  {edu.degree}    
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default UniversityDropdowns;