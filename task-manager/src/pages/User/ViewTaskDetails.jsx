import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCallback } from "react";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/layouts/DashboardLayout";
// import AvatarGroup from "../../components/AvatarGroup";
import moment from "moment";
import { LuSquareArrowOutUpRight } from "react-icons/lu";
import "../../App.css";
import "./ViewTaskDetails.css";
import axiosInstance from "../../utils/axiosinstance";

const ViewTaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);

  const getStatusTagColor = (status) => {
    switch (status) {
      case "In-Progress":
        return "in-progress-status-styles";

      case "Completed":
        return "completed-status-styles";

      default:
        return "default-status-styles";
    }
  };

  // get Task info by ID
  const getTaskDetailsByID = useCallback( async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_TASK_BY_ID(id)
      );

      if (response.data) {
        const taskInfo = response.data;
        setTask(taskInfo);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, [id]);

  // handle todo check
  const updateTodoChecklist = async (index) => {
    // eslint-disable-next-line no-unsafe-optional-chaining
    const todoChecklist = [...task?.todoChecklist];
    const taskId = id;

    if (todoChecklist && todoChecklist[index]) {
      todoChecklist[index].completed = !todoChecklist[index].completed;

      try {
        const response = await axiosInstance.put(
          API_PATHS.TASKS.UPDATE_TODO_CHECKLIST(taskId),
          { todoChecklist }
        );
        if (response.status === 200) {
          setTask(response.data?.task || task);
        } else {
          // Optionally revert the toggle if the API call fails.
          todoChecklist[index].completed = !todoChecklist[index].completed;
        }
      } catch (error) {
        todoChecklist[index].completed = !todoChecklist[index].completed;
        console.log("update error", error.message);
      }
    }
  };

  // Handle attachment link lick
  const handleLinkClick = (link) => {
    if (!/^https?:\/\//i.test(link)) {
      link = "https://" + link; // Default to HTTPS
    }
    window.open(link, "_blank");
  };

  useEffect(() => {
    if (id) {
      getTaskDetailsByID();
    }
    //return () => {};
  }, [id, getTaskDetailsByID]);
  return (
    <DashboardLayout activeMenu="My Tasks">
      <div className="my-tasks-section-spacing">
        {task && (
          <div className="custom-grid-style">
            <div className="form-card column">
              <div className="flex-between-center">
                <h2 className="text-responsive">{task?.title}</h2>

                <div
                  className={`text-custom ${getStatusTagColor(task?.status)} `}
                >
                  {task?.status}
                </div>
              </div>

              <div className="description-section-margin">
                <InfoBox label="Description" value={task?.description} />
              </div>

              <div className="description-grid-custom">
                <div className="column-length">
                  <InfoBox label="Priority" value={task?.priority} />
                </div>
                <div className="column-length">
                  <InfoBox
                    label="Due Date"
                    value={
                      task?.dueDate
                        ? moment(task?.dueDate).format("Do MMM YYYY")
                        : "N/A"
                    }
                  />
                </div>
                {/* <div className="column-length">
                  <label className="text-xs font-medium text-slate-500">
                    Assigned To
                  </label>

                  <AvatarGroup
                    avatars={
                      task?.assignedTo?.map((item) => item?.profileImageUrl) ||
                      []
                    }
                    maxVisible={5}
                  />
                </div> */}
              </div>

              <div className="todo-checklist-top">
                <label className="font-properties">Todo Checklist</label>

                {task?.todoChecklist?.map((item, index) => (
                  <TodoCheckList
                    key={`todo_${index}`}
                    text={item.text}
                    isChecked={item?.completed}
                    onChange={() => updateTodoChecklist(index)}
                  />
                ))}
              </div>

              {task?.attachments?.length > 0 && (
                <div className="attachments-top">
                  <label className="font-properties">Attachments</label>

                  {task?.attachments?.map((link, index) => (
                    <Attachment
                      key={`link_${index}`}
                      link={link}
                      index={index}
                      onClick={() => handleLinkClick(link)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ViewTaskDetails;

const InfoBox = ({ label, value }) => {
  return (
    <>
      <label className="font-properties">{label}</label>

      <p className="infobox-properties">{value}</p>
    </>
  );
};

const TodoCheckList = ({ text, isChecked, onChange }) => {
  return (
    <div className="todo-checklist-flex">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onChange}
        className="todo-checklist-input-field"
      />

      <p className="todo-checklist-text">{text}</p>
    </div>
  );
};

const Attachment = ({ link, index, onClick }) => {
  return (
    <div className="attachment-container" onClick={onClick}>
      <div className="attachment-flex">
        <span className="attachment-span-text">
          {index < 9 ? `0${index + 1}` : index + 1}
        </span>

        <p className="attachment-para-text">{link}</p>
      </div>

      <LuSquareArrowOutUpRight className="custom-text-gray" />
    </div>
  );
};
