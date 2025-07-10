import React, { useState } from "react";
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";
import { LuPaperclip } from "react-icons/lu";
import "../../App.css";
import "./AddAttachmentsInput.css";

const AddAttachmentsInput = ({ attachments, setAttachments }) => {
  const [option, setOption] = useState("");

  // Function to handle adding an option
  const handleAddOption = () => {
    if (option.trim()) {
      setAttachments([...attachments, option.trim()]);
      setOption("");
    }
  };

  // Function to handle deleting an option
  const handleDeleteOption = (index) => {
    const updatedArr = attachments.filter((_, idx) => idx !== index);
    setAttachments(updatedArr);
  };

  return (
    <div>
      {attachments.map((item, index) => (
        <div key={item} className="attachments-input">
          <div className="flex-container">
            <LuPaperclip className="text-color" />
            <p className="para-text">{item}</p>
          </div>

          <button
            className="button"
            onClick={() => {
              handleDeleteOption(index);
            }}
          >
            <HiOutlineTrash className="outline" />
          </button>
        </div>
      ))}

      <div className="file-link">
        <div className="file-link-container">
          <LuPaperclip className="file-link-text" />

          <input
            type="text"
            placeholder="Add File Link"
            value={option}
            onChange={({ target }) => setOption(target.value)}
            className="input-field"
          />
        </div>

        <button className="card-btn wrap" onClick={handleAddOption}>
          <HiMiniPlus className="button-text" /> Add
        </button>
      </div>
    </div>
  );
};

export default AddAttachmentsInput;
