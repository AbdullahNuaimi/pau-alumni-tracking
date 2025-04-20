import './editUserInfo.css';
import { useUser } from '../../contexts/UserContext';
import { useState } from 'react';
import { toast, Bounce } from 'react-toastify';
import axios from 'axios';

const EditUserInfo = () => {
    const { user, setUser } = useUser();
    const [editMode, setEditMode] = useState(true);
    const [editedUser, setEditedUser] = useState(user);
    // const [socialMedia, setSocialMedia] = useState({ label: '', link: '' });
    const [socialMediaLink, setSocialMediaLink] = useState('');
    const [socialMediaLabel, setSocialMediaLabel] = useState('');
    const validateEmail = (input) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
    const validatePhone = (input) => /^(?:\+970|00970|970|0)(?:5[0-9])\d{7}$/.test(input);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedUser((prev) => ({ ...prev, [name]: value }));
    }
    const handleSave = async () => {
        const isEmailValid = validateEmail(editedUser.email);
        const isPhoneValid = validatePhone(editedUser.phone);
        if (!isEmailValid) {
            toast.error('صيغة الايميل غير صحيحة', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
            return;
        }
        if (editedUser.phone) {
            if (!isPhoneValid) {
                toast.error('صيغة رقم الجوال غير صحيحة', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                });
                return;
            }
        }
        const updatedUser = editedUser;
        const response = await axios.put('http://localhost:5000/api/v1/auth/updateInfo', updatedUser);


        // setUser(editedUser);
        // localStorage.setItem('user', JSON.stringify(editedUser));
        setEditMode(true);
    }
    const addSocialMedia = () => {
        console.log('socialMediaLabel', socialMediaLabel);
        console.log('socialMediaLink', socialMediaLink);
        setEditedUser((prev) => ({ ...prev, socialMedia: [...prev.socialMedia, { link: socialMediaLink, label: socialMediaLabel }] }));
        console.log(editedUser.socialMedia);
    };

    const handleDeleteSocial = (index) => () => {
        setEditedUser((prev) => {
            const updatedSocialMedia = [...prev.socialMedia];
            updatedSocialMedia.splice(index, 1);
            return { ...prev, socialMedia: updatedSocialMedia };
        });
    }

    return (
        <div className='editUserInfo-container'>
            <button className='editUserInfo-btn' type='button' onClick={() => editMode ? setEditMode(false) : setEditMode(true)}>تعديل</button>
            <div className='input-container'>
                <input type="text" name='name' placeholder='الاسم' disabled={editMode} value={editedUser.name} onChange={handleChange} />
                <input type="text" name='email' placeholder='البريد الالكتروني' disabled={editMode} value={editedUser.email} onChange={handleChange} />
                <input type="text" name='phone' placeholder='رقم الجوال' disabled={editMode} value={editedUser.phone} onChange={handleChange} />
            </div>
            <div className='socialMedia-container'>
                <input type="text" name='label' disabled={editMode} placeholder='Linkedin' value={socialMediaLabel} onChange={e => setSocialMediaLabel(e.target.value)} />
                <input type="text" name="link" disabled={editMode} placeholder='https://linkedin.com/userName' value={socialMediaLink} onChange={e => setSocialMediaLink(e.target.value)} />
                {!editMode && <button type='button' onClick={addSocialMedia}>إضافة</button>}
            </div>
            {editedUser.socialMedia && editedUser.socialMedia.length > 0 && (
                <div className="socialMedia-list">
                    <ul>
                        {editedUser.socialMedia.map((social, index) => (
                            <li key={index}>
                                <span className='delete-btn' onClick={handleDeleteSocial(index)}>❌    </span><a href={social.link} target='_blank'>{social.label}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {!editMode &&
                <button type='button' onClick={handleSave}>حفظ</button>
            }
        </div>
    )
}

export default EditUserInfo;