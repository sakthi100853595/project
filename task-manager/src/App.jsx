import React, { useState, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthPage from "./Auth/AuthPage";

import { logout, checkAuth } from "./Auth/Auth";
import Home from "./components/Home";
import "./App.css";
import PrivateRoute from "./routes/PrivateRoute";
import Dashboard from "./pages/Admin/Dashboard";
import MyTasks from "./pages/User/MyTasks";
import ViewTaskDetails from "./pages/User/ViewTaskDetails";
import UserProvider, { UserContext } from "./context/useContext";
import UserDashboard from "./pages/User/UserDashboard";
import ManageTasks from "./pages/User/ManageTasks";
import CreateTask from "./pages/User/CreateTask";
import ManageUsers from "./pages/User/ManageUsers";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(checkAuth());

  return (
    <UserProvider>
      <Router>
        <div>
          <Routes>
            <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
              <Route element={<PrivateRoute allowedRoles={["user"]} />}>
                <Route
                  path="/user/dashboard"
                  element={<UserDashboard isAuthenticated={isAuthenticated} />}
                />

                <Route path="/user/my-tasks" element={<MyTasks />} />
                <Route path="/user/manage-tasks" element={<ManageTasks />} />

                <Route
                  path="/user/task-details/:id"
                  element={<ViewTaskDetails />}
                />

                <Route path="/user/create-task" element={<CreateTask />} />
                <Route path="/user/users" element={<ManageUsers />} />
              </Route>
            </Route>

            <Route
              path="/auth"
              element={
                <AuthPage
                  isAuthenticated={isAuthenticated}
                  setIsAuthenticated={setIsAuthenticated}
                />
              }
            />

            <Route
              path="*"
              element={
                isAuthenticated ? (
                  <Navigate to="/user/dashboard" />
                ) : (
                  <Navigate to="/auth" />
                )
              }
            />

            <Route path="/" element={<Root />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
};
export default App;

const Root = () => {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return user.role === "admin" ? (
    <Navigate to="/admin/dashboard" />
  ) : (
    <Navigate to="/user/dashboard" />
  );
};

{
  /* <Route
              path="/"
              element={<Home onLogout={() => logout(setIsAuthenticated)} />}
            /> */
}
{
  /* <Route path="/user/dashboard" element={<UserDashboard />} /> */
}
{
  /* Admin Routes
            
            <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/tasks" element={<ManageTasks />} />
              <Route path="/admin/create-task" element={<CreateTask />} />
              <Route path="/admin/users" element={<ManageUsers />} />
            </Route> */
}

{
  /* <Route
              path="/user/dashboard"
              element={<Dashboard isAuthenticated={isAuthenticated} />}
            /> */
}
{
  /* <Route path="/user/tasks" element={<MyTasks />} />
            <Route
              path="/user/task-details/:id"
              element={<ViewTaskDetails />}
            /> */
}
