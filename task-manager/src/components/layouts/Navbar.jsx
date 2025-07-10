import React, { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import SideMenu from "./SideMenu";
import "./Navbar.css";

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);

  return (
    <div className="navbar">
      <button
        className="menu-toggle"
        onClick={() => {
          setOpenSideMenu(!openSideMenu);
        }}
      >
        {openSideMenu ? (
          <HiOutlineX className="heading-large" />
        ) : (
          <HiOutlineMenu className="heading-large" />
        )}
      </button>

      <h2 className="text-block">Task Manager</h2>

      {openSideMenu && (
        <div className="fixed-menu">
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
