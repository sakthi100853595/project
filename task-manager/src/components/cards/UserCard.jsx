import React from "react";
import "./UserCard.css";

const UserCard = ({ userInfo }) => {
  return (
    <div className="user-card padding">
      <div className="user-card-flex">
        <div className="user-card-container-1">
          <img
            src={userInfo?.profileImageUrl}
            alt={`Avatar`}
            className="user-card-avatar"
          />

          <div>
            <p className="name-text">{userInfo?.name}</p>
            <p className="email-text">{userInfo?.email}</p>
          </div>
        </div>
      </div>

      <div className="user-card-container-2">
        <StatCard
          label="Pending"
          count={userInfo?.pendingTasks || 0}
          status="Pending"
        />
        <StatCard
          label="In-Progress"
          count={userInfo?.inProgressTasks || 0}
          status="In-Progress"
        />
        <StatCard
          label="Completed"
          count={userInfo?.completedTasks || 0}
          status="Completed"
        />
      </div>
    </div>
  );
};

export default UserCard;

const StatCard = ({ label, count, status }) => {
  const getStatusTagColor = () => {
    switch (status) {
      case "In-Progress":
        return "in-progress-user-card";

      case "Completed":
        return "completed-user-card";

      default:
        return "default-user-card";
    }
  };

  return (
    <div className={`custom-status-tag ${getStatusTagColor()}`}>
      <span className="span-count-text">{count}</span> <br /> {label}
    </div>
  );
};
