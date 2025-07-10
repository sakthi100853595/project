import React from "react";
import "./CustomLegend.css";

const CustomLegend = ({ payload }) => {
  return (
    <div className="custom-legend-container">
      {payload.map((entry, index) => (
        <div key={`legend-${index}`} className="flex-items-space">
          <div
            className="circle-dot"
            style={{ backgroundColor: entry.color }}
          ></div>
          <span className="text-info">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export default CustomLegend;
