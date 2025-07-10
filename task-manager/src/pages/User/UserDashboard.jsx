import React, { useEffect, useState } from "react";
import { useCallback } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { API_PATHS } from "../../utils/apiPaths";
import moment from "moment";
import "../../App.css";
import "./UserDashboard.css";
import { addThousandsSeparator } from "../../utils/helper";
import InfoCard from "../../components/cards/InfoCard";
import { LuArrowRight } from "react-icons/lu";
import TaskListTable from "../../components/TaskListTable";
import axiosInstance from "../../utils/axiosinstance";
import CustomPieChart from "../../components/Charts/CustomPieChart";
import CustomBarChart from "../../components/Charts/CustomBarChart";

const COLORS = ["#8D51FF", "#00B8DB", "#7BCE00"];

const UserDashboard = () => {
  console.log("call is coming from User dashboard");
  const navigate = useNavigate();

  const storedUser = sessionStorage.getItem("userData");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  // Prepare Chart Data
  const prepareChartData = (data) => {
    const taskDistribution = data?.taskDistribution || null;
    const taskPriorityLevels = data?.taskPriorityLevels || null;

    const taskDistributionData = [
      { status: "Pending", count: taskDistribution?.Pending || 0 },
      { status: "In-progress", count: taskDistribution?.InProgress || 0 },
      { status: "Completed", count: taskDistribution?.Completed || 0 },
    ];

    setPieChartData(taskDistributionData);

    const PriorityLevelData = [
      { priority: "Low", count: taskPriorityLevels?.Low || 0 },
      { priority: "Medium", count: taskPriorityLevels?.Medium || 0 },
      { priority: "High", count: taskPriorityLevels?.High || 0 },
    ];

    setBarChartData(PriorityLevelData);
  };

  const getDashboardData = useCallback(async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_USER_DASHBOARD_DATA
      );
      if (response.data) {
        setDashboardData(response.data);
        prepareChartData(response.data?.charts || null);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, []);

  const onSeeMore = () => {
    navigate("/admin/tasks");
  };

  useEffect(() => {
    getDashboardData();

   // return () => {};
  }, [getDashboardData]);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="card dash">
        <div className="grid-container">
          <div className="col-span-3">
            <h2 className="custom-heading">Welcome, {user?.name}</h2>
            <p className="custom-paragraph">
              {moment().format("dddd Do MMM YYYY")}
            </p>
          </div>
        </div>

        <div className="infocard-box">
          <InfoCard
            label="Total Tasks"
            value={addThousandsSeparator(
              dashboardData?.charts?.taskDistribution?.All || 0
            )}
            color="#9f2b68"
          />

          <InfoCard
            label="Pending Tasks"
            value={addThousandsSeparator(
              dashboardData?.charts?.taskDistribution?.Pending || 0
            )}
            color="#8b5cf6"
          />

          <InfoCard
            label="In-Progress Tasks"
            value={addThousandsSeparator(
              dashboardData?.charts?.taskDistribution?.InProgress || 0
            )}
            color="#06b6d4"
          />

          <InfoCard
            label="Completed Tasks"
            value={addThousandsSeparator(
              dashboardData?.charts?.taskDistribution?.Completed || 0
            )}
            color="#84cc16"
          />
        </div>
      </div>

      <div className="custom-grid">
        <div>
          <div className="card">
            <div className="chart-container">
              <h5 className="chart-text">Task Distribution</h5>
            </div>

            <CustomPieChart data={pieChartData} colors={COLORS} />
          </div>
        </div>

        <div>
          <div className="card">
            <div className="chart-container">
              <h5 className="chart-text">Task Priority Levels</h5>
            </div>

            <CustomBarChart data={barChartData} />
          </div>
        </div>

        <div className="custom-col-span">
          <div className="card">
            <div className="custom-flex">
              <h5 className="custom-text">Recent Tasks</h5>

              <button className="card-btn" onClick={onSeeMore}>
                See All
                <LuArrowRight className="custom-text-base" />
              </button>
            </div>
            <TaskListTable tableData={dashboardData?.recentTasks || []} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
