import React from "react";
import { Link, Outlet } from "react-router-dom";

const TasksLayout = () => {
  return (
    <div>
      <nav>
        <Link to="/user/tasks/my-tasks">My Tasks</Link>
        <Link to="/user/tasks/manage-tasks">Manage Tasks</Link>
      </nav>

      <Outlet />
    </div>
  );
};

export default TasksLayout;
