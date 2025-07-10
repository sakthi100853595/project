import React, { useState } from "react";
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";
import "../../App.css";
import "./TodoListInput.css";

const TodoListInput = ({ todoList, setTodoList }) => {
  const [option, setOption] = useState("");

  // Function to handle adding an option
  const handleAddOption = () => {
    if (option.trim()) {
      setTodoList([...todoList, option.trim()]);
      setOption("");
    }
  };

  // Function to handle deleting an option
  const handleDeleteOption = (index) => {
    const updatedArr = todoList.filter((_, idx) => idx !== index);
    setTodoList(updatedArr);
  };
  return (
    <div>
      {todoList.map((item, index) => (
        <div key={item} className="todo-item">
          <p className="todo-text">
            <span className="todo-span">
              {index < 9 ? `0${index + 1}` : index + 1}
            </span>
            {item}
          </p>

          <button
            className="button"
            onClick={() => {
              handleDeleteOption(index);
            }}
          >
            <HiOutlineTrash className="todo-outline" />
          </button>
        </div>
      ))}

      <div className="todo-item-row">
        <input
          type="text"
          placeholder="Enter Task"
          value={option}
          onChange={({ target }) => setOption(target.value)}
          className="todo-input"
        />

        <button className="card-btn wrap" onClick={handleAddOption}>
          <HiMiniPlus className="button-text" /> Add
        </button>
      </div>
    </div>
  );
};

export default TodoListInput;
