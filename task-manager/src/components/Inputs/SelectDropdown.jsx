import React, { useState } from "react";
import { LuChevronDown } from "react-icons/lu";
import "./SelectDropdown.css";

const SelectDropdown = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="dropdown-container">
      {/* Dropdown Button */}
      <button onClick={() => setIsOpen(!isOpen)} className="dropdown-button">
        {value
          ? options.find((opt) => opt.value === value)?.label
          : placeholder}
        <span className="dropdown-span">
          {isOpen ? (
            <LuChevronDown className="rotate-180" />
          ) : (
            <LuChevronDown />
          )}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="dropdown-menu">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className="dropdown-item"
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectDropdown;
