import React from "react";
import moment from "moment";

const TaskListTable = ({ tableData }) => {
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Completed":
        return "completed-css";
      case "Pending":
        return "pending-css";
      case "In-Progress":
        return "in-progress-css";
      default:
        return "default-css";
    }
  };
  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case "High":
        return "high-priority";
      case "Medium":
        return "medium-priority";
      case "Low":
        return "low-priority";
      default:
        return "default-priority";
    }
  };

  return (
    <div className="custom-scroll-container">
      <table className="table-min-width-full">
        <thead>
          <tr className="text-left">
            <th className="text-cell">Name</th>
            <th className="text-cell">Status</th>
            <th className="text-cell">Priority</th>
            <th className="text-cell-hidden">Created On</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((task) => (
            <tr key={task._id} className="table-top-border">
              <td className="table-truncated-text">{task.title}</td>
              <td className="table-cell-data-padding">
                <span
                  className={`status-badge ${getStatusBadgeColor(task.status)}`}
                >
                  {task.status}
                </span>
              </td>
              <td className="table-cell-data-padding">
                <span
                  className={`priority-badge ${getPriorityBadgeColor(
                    task.priority
                  )}`}
                >
                  {task.priority}
                </span>
              </td>
              <td className="table-cell-data">
                {task.createdAt
                  ? moment(task.createdAt).format("Do MMM YYYY")
                  : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskListTable;
