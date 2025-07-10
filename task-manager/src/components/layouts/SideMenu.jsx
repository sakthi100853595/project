import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from "../../utils/data";
import "./SideMenu.css";
import { checkAuth, logout, getUser } from "../../Auth/Auth";

const SideMenu = ({ activeMenu, setAuth }) => {
  //   const { user, clearUser } = useState(UserContext);
  const [sideMenuData, setSideMenuData] = useState([]);
  const [user, setUser] = useState(null); // Track user
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  // const isAuthenticated = () => {
  //   const token = sessionStorage.getItem("token"); // or localStorage
  //   return !!token;
  // };

  // const getUser = () => {
  //   const storedUser = sessionStorage.getItem("user");
  //   return storedUser ? JSON.parse(storedUser) : null;
  // };

  // useEffect(() => {
  //   const token = sessionStorage.getItem("token");
  //   const userData = sessionStorage.getItem("user");

  //   if (!token || !userData) {
  //     navigate("/auth", { replace: true });
  //     return;
  //   }

  //   const parsedUser = JSON.parse(userData);
  //   setUser(parsedUser);

  //   setSideMenuData(
  //     parsedUser.role === "admin" ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA
  //   );

  //   setCheckingAuth(false); // Done checking
  // }, []);

  const handleClick = (route) => {
    if (route === "logout") {
      // sessionStorage.clear();
      handleLogout();
      // return;
    } else {
      navigate(route);
    }
  };

  const handleLogout = () => {
    // sessionStorage.clear();
    // clearUser();
    logout(setAuth);
    navigate("/auth");
  };

  useEffect(() => {
    const checkUser = () => {
      const isLoggedIn = checkAuth();
      if (!isLoggedIn) {
        navigate("/auth", { replace: true });

        return;
      }

      const userData = getUser();
      if (userData) {
        setUser(userData);
        setSideMenuData(
          userData.role === "admin" ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA
        );
      }
      setChecking(false);
    };

    checkUser();
  }, []);

  if (checking) return null;

  return (
    <div className="side-menu">
      <div className="user-profile">
        <div className="profile-image">
          <img
            src={user?.profileImageUrl || "/profile-2.jpg"}
            alt="Profile Image"
            className="picture"
          />
        </div>

        {user?.role === "admin" && <div className="badge">Admin</div>}

        <h5 className="user-name">{user?.name || ""}</h5>
        <p className="user-email">{user?.email || ""}</p>
      </div>
      <div className="menu-list">
        {sideMenuData.map((item, index) => (
          <button
            key={`menu_${index}`}
            className={`menu-button ${
              activeMenu == item.label ? "active" : ""
            } `}
            onClick={() => handleClick(item.path)}
          >
            <item.icon className="icon" />
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SideMenu;
