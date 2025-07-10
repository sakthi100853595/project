import React from "react";
import "./CustomToolTip.css";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="tooltip-container">
        <p className="tooltip-label-text">{payload[0].name}</p>
        <p className="tooltip-description-text">
          Count: <span className="tooltip-span-text">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
