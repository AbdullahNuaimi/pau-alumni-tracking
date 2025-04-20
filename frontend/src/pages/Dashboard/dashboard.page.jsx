import "./dashboard.css"
import UniversityDropdowns from "../../components/EducationSelection/educationSelection.component";
import EditUserInfo from "../../components/EditUserInfo/editUserInfo.component";
const Dashboard = () => {

  return (
    <div className="dashboard-container">
      <h1>Dashbord page</h1>
      <UniversityDropdowns />
      <EditUserInfo />
    </div>
  );
};

export default Dashboard;