import Main from "./Main/Main";
import Sidebar from "./Sidebar/Sidebar";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-[#0f1014] text-white">
      <Sidebar />
      <Main />
    </div>
  );
};

export default AdminDashboard;