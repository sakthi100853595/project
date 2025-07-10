import React from "react";
import "./DeleteAlert.css";

const DeleteAlert = ({ content, onDelete }) => {
  return (
    <div>
      <p className="font-properties">{content}</p>

      <div className="delete-alert-container">
        <button type="button" className="button" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteAlert;
