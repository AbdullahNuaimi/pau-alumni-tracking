import "./dashboard.css"
import UniversityDropdowns from "../../components/EducationSelection/educationSelection.component";
import EditUserInfo from "../../components/EditUserInfo/editUserInfo.component";
import ProfileImageUploader from "../../components/profileImageUploader/profileImageUploader.component";
import CareerEditor from "../../components/CareerEditor/careerEditor.component";

const Dashboard = () => {

  return (
    <div className="dashboard-container">
      <h1>Dashbord page</h1>
      <UniversityDropdowns />
      <EditUserInfo />
      <ProfileImageUploader />
      <CareerEditor />
    </div> 
  );
};

export default Dashboard;