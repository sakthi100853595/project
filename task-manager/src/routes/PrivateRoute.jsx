import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { checkAuth } from "../Auth/Auth";

const PrivateRoute = ({ isAuthenticated }) => {
  const auth = isAuthenticated ?? checkAuth();

  return auth ? <Outlet /> : <Navigate to="/auth" />;
};

export default PrivateRoute;
