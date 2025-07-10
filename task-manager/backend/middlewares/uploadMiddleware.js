const multer = require("multer");
const express = require("express");
const path = require("path");

//Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

//File filter
const fileFilter = (req, file, cb) => {
  console.log("File MIME type:", file.mimetype);
  console.log("File extension:", path.extname(file.originalname).toLowerCase());

  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpeg, .jpg and .png formats allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
