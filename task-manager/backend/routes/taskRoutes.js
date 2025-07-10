const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  getUserDashboardData,
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskChecklist,
} = require("../controllers/taskController");

const router = express.Router();

//Task Management Routes
// router.get("/dashboard-data", protect, getDashboardData);  (it is for admin only)
router.get("/user-dashboard-data", protect, getUserDashboardData);
router.get("/", protect, getTasks); //Get all Tasks (Admin: all, User: assigned)
router.post("/", protect, createTask); //you can give adminOnly status inbetweem the two variables
router.put("/:id/status", protect, updateTaskStatus);
router.put("/:id/todo", protect, updateTaskChecklist);
router.get("/:id", protect, getTaskById);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask); //you can give adminOnly status inbetweem the two variables

module.exports = router;
