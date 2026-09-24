import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navigation from "./pages/Auth/Navigation";

const App = () => {
  return (
    <div className="min-h-screen bg-[#08090b] text-white">
      <ToastContainer
        position="top-right"
        theme="dark"
        autoClose={2500}
      />

      <Navigation />

      <main className="pt-20">
        <Outlet />
      </main>
    </div>
  );
};

export default App;