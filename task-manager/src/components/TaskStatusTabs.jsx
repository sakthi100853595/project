import React from "react";
import "./TaskStatusTabs.css";

const TaskStatusTabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="status-tab-top">
      <div className="status-tab-container">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            className={`tab-button ${
              activeTab === tab.label ? "active" : "inactive"
            } `}
            onClick={() => setActiveTab(tab.label)}
          >
            <div className="flex-center">
              <span className="span-text">{tab.label}</span>
              <span
                className={`tab-badge ${
                  activeTab === tab.label
                    ? ".tab-badge-active"
                    : "tab-badge-inactive"
                }`}
              >
                {tab.count}
              </span>
            </div>
            {activeTab === tab.label && <div className="tab-underline"></div>}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TaskStatusTabs;
