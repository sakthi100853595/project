import React from "react";
import "./InfoCard.css";

const InfoCard = ({ icon, label, value, color }) => {
  return (
    <div className="infocard-container">
      <div className="circle" style={{ backgroundColor: color }}></div>

      <p className="text-custom">
        <span className="span-text-custom">{value}</span> {label}
      </p>
    </div>
  );
};

export default InfoCard;
