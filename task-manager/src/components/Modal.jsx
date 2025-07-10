import React from "react";
import "./Modal.css";

const Modal = ({ children, isOpen, onClose, title }) => {
  if (!isOpen) return;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Modal content */}
        <div className="modal-content">
          {/* Modal header */}

          <div className="modal-header">
            <h3 className="modal-title"> {title}</h3>

            <button type="button" className="modal-close-btn" onClick={onClose}>
              <svg
                className="small-icon"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
            </button>
          </div>

          {/* Modal body */}
          <div className="modal-body">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
