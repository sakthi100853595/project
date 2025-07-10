import React from "react";
import Progress from "../Progress";
// import AvatarGroup from "../AvatarGroup";
import { LuPaperclip } from "react-icons/lu";
import moment from "moment";
import "./TaskCard.css";

const TaskCard = ({
  title,
  description,
  priority,
  status,
  progress,
  createdAt,
  dueDate,
  assignedTo,
  attachmentCount,
  completedTodoCount,
  todoChecklist,
  onClick,
}) => {
  const getStatusTagColor = () => {
    switch (status) {
      case "In-Progress":
        return "in-progress-status";

      case "Completed":
        return "completed-status";

      default:
        return "default-status";
    }
  };

  const getPriorityTagColor = () => {
    switch (priority) {
      case "Low":
        return "low-priority";

      case "Medium":
        return "medium-priority";

      default:
        return "high-priority";
    }
  };

  return (
    <div className="task-card-structure" onClick={onClick}>
      <div className="task-card-flex-container">
        <div className={`status-container ${getStatusTagColor()}`}>
          {status}
        </div>
        <div className={`priority-container ${getPriorityTagColor()}`}>
          {priority} Priority
        </div>
      </div>

      <div
        className={`status-border ${
          status === "In-Progress"
            ? "border-cyan-500"
            : status === "Completed"
            ? "border-indigo-500"
            : "border-violet-500"
        }`}
      >
        <p className="title">{title}</p>

        <p className="description">{description}</p>

        <p className="task-done">
          Task Done:{" "}
          <span className="span-text">
            {completedTodoCount} / {todoChecklist.length || 0}
          </span>
        </p>

        <Progress progress={progress} status={status} />
      </div>

      <div className="extras">
        <div className="duration">
          <div>
            <label className="date">Start Date</label>
            <p className="date-text">
              {moment(createdAt).format("Do MMM YYYY")}
            </p>
          </div>

          <div>
            <label className="date">Due Date</label>
            <p className="date-text">{moment(dueDate).format("Do MMM YYYY")}</p>
          </div>
        </div>

        <div className="flex-container">
          {/* <AvatarGroup avatars={assignedTo || []} /> */}

          {attachmentCount > 0 && (
            <div className="attachment-container">
              <LuPaperclip className="text-color" />{" "}
              <span className="text-span">{attachmentCount}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
