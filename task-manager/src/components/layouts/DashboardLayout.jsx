import React, { useContext } from "react";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";
import { useNavigate } from "react-router-dom";
import { checkAuth } from "../../Auth/Auth";
import "./DashboardLayout.css";

const DashboardLayout = ({ children, activeMenu }) => {
  //   const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const isAuthenticated = checkAuth();

  if (!isAuthenticated) {
    navigate("/auth");
    return null; // Or a loading spinner while redirecting
  }
  return (
    <div className="dashboard-wrapper">
      <Navbar activeMenu={activeMenu} />
      {/* {isAuthenticated && ( */}
      <div className="dashboard-body">
        <div className="dashboard-media-query">
          <SideMenu activeMenu={activeMenu} />
        </div>
        <div className="dashboard-content">{children}</div>
      </div>
      {/* )} */}
    </div>
  );
};

export default DashboardLayout;
