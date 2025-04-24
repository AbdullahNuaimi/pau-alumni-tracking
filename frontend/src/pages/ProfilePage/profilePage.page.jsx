import React from 'react';
import './profilePage.css';
import ProfileImageUploader from '../../components/profileImageUploader/profileImageUploader.component';
import EditUserInfo from '../../components/EditUserInfo/editUserInfo.component';
import EducationSelection from '../../components/EducationSelection/educationSelection.component';
import CareerEditor from '../../components/CareerEditor/careerEditor.component';
import PasswordUpdater from '../../components/PasswordUpdater/passwordUpdater.component';
import UserActivity from '../../components/UserActivity/userActivity.component';
import { useUser } from '../../contexts/UserContext';

const ProfilePage = () => {
  const {user} = useUser();
  return (
    <div className="profile-page-container">
      <div className="profile-header">
        <h1>الملف الشخصي</h1>
      </div>

      <div className="profile-sections">

        <div className="profile-section">
          <ProfileImageUploader />
        </div>


        <div className="profile-section">
          <EditUserInfo />
        </div>


        <div className="profile-section">
          <EducationSelection />
        </div>


        <div className="profile-section">
          <CareerEditor />
        </div>


        <div className="profile-section">
          <PasswordUpdater />
        </div>
      </div>


      <div className="profile-section" style={{ gridColumn: '1 / -1' }}>
        <UserActivity user={user}/>
      </div>
    </div>
  );
};

export default ProfilePage;