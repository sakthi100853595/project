const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { getUserById } = require("../controllers/userController");
const { getUsers } = require("../controllers/userController");

const router = express.Router();

//User Management Routes
// router.get("/", protect, adminOnly, getUsers); //Get all users (Admin only)
router.get("/", protect, getUsers); //Get all users
router.get("/:id", protect, getUserById); //Get specific user
// router.delete("/:id", protect, adminOnly, deleteUser); //Delete user (Admin only)

module.exports = router;
