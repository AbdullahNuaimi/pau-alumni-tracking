import "./dashboard.css"
import UniversityDropdowns from "../../components/EducationSelection/educationSelection.component";

const Dashboard = () => {

  return (
    <div className="dashboard-container">
      <h1>Dashbord page</h1>
      <UniversityDropdowns />
    </div>
  );
};

export default Dashboard;