import "./dashboard.css"
import UniversityDropdowns from "../../components/EducationSelection/educationSelection.component";
import EditUserInfo from "../../components/EditUserInfo/editUserInfo.component";
import ProfileImageUploader from "../../components/profileImageUploader/profileImageUploader.component";

const Dashboard = () => {

  return (
    <div className="dashboard-container">
      <h1>Dashbord page</h1>
      <UniversityDropdowns />
      <EditUserInfo />
      <ProfileImageUploader />
    </div> 
  );
};

export default Dashboard;