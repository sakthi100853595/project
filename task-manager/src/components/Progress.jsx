import React from "react";
import "./Progress.css";

const Progress = ({ progress, status }) => {
  const getColor = () => {
    switch (status) {
      case "In-Progress":
        return "in-progress-styles";

      case "Completed":
        return "completed-styles";

      default:
        return "default-styles";
    }
  };

  return (
    <div className="progress-container">
      <div
        className={`${getColor()} custom-progress`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default Progress;
