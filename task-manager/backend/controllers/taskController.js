const { default: mongoose } = require("mongoose");
const Task = require("../models/Task");
const { param } = require("../routes/authRoutes");

//@desc Get all tasks (Admin: all, User: only assigned) but here all user has accessbility
//@route GET  /api/tasks/
// @access Private
const getTasks = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};
    if (status) {
      filter.status = status;
    }

    let tasks;

    if (req.user.role === "admin") {
      tasks = await Task.find(filter).populate(
        "assignedTo",
        "name email profileImageUrl"
      );
    } else {
      tasks = await Task.find({ ...filter, assignedTo: req.user._id }).populate(
        "assignedTo",
        "name email profileImageUrl"
      );
    }

    //Add completed todoChecklist count to each task
    tasks = await Promise.all(
      tasks.map(async (task) => {
        const completedCount = task.todoChecklist.filter(
          (item) => item.completed
        ).length;
        return { ...task._doc, completedTodoCount: completedCount };
      })
    );

    //Status summary counts
    const allTasks = await Task.countDocuments(
      req.user.role === "admin" ? {} : { assignedTo: req.user._id }
    );

    const pendingTasks = await Task.countDocuments({
      ...filter,
      status: "Pending",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });
    const inProgressTasks = await Task.countDocuments({
      ...filter,
      status: "In-Progress",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });
    const completedTasks = await Task.countDocuments({
      ...filter,
      status: "Completed",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });

    res.json({
      tasks,
      statusSummary: {
        all: allTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Get task by ID
// @route GET  /api/tasks/:id
// @access Private

const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Task ID" });
    }
    console.log("🔴 Hitting getTaskById with ID:", req.params.id);
    const task = await Task.findById(req.params.id).populate(
      "assignedTo",
      "name email profileImageUrl"
    );

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//@desc Create a new task (Admin only) (but here anyone can create task)
//@route POST /api/tasks/
// @access Private
const createTask = async (req, res) => {
  try {
    console.log("📦 Incoming Task Data:", req.body);
    const {
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      attachments,
      todoChecklist,
    } = req.body;
    // if (!Array.isArray(assignedTo)) {
    //   return res
    //     .status(400)
    //     .json({ message: "assignedTo must be an array of user IDs" });
    // }

    // Make sure assignedTo is a valid array
    if (!Array.isArray(assignedTo)) {
      return res
        .status(400)
        .json({ message: "assignedTo must be an array of user IDs" });
    }

    // Clean: Remove empty values & convert to ObjectIds
    let assignees = assignedTo
      .filter((id) => id && id.trim() !== "")
      .map((id) => new mongoose.Types.ObjectId(id));

    // Ensure the creator is also included
    const userId = req.user._id;
    const alreadyAssigned = assignees.some(
      (id) => id.toString() === userId.toString()
    );

    if (!alreadyAssigned) {
      assignees.push(userId); // Already an ObjectId
    }

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      assignedTo: assignees,
      createdBy: req.user._id,
      todoChecklist,
      attachments,
    });

    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//@desc Update task details
//@route PUT /api/tasks/:id
// @access Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    const isOwner = task.createdBy.toString() === req.user._id.toString();

    if (!isOwner && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this task" });
    }

    await task.deleteOne();

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//@desc DELETE a task (Admin only) (but here it is for all users)
//@route PUT /api/tasks/:id
// @access Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    const isOwner = task.createdBy.toString() === req.user._id.toString();

    if (!isOwner && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to update this task" });
    }

    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.priority = req.body.priority || task.priority;
    task.dueDate = req.body.dueDate || task.dueDate;
    task.todoChecklist = req.body.todoChecklist || task.todoChecklist;
    task.attachments = req.body.attachments || task.attachments;

    if (req.body.assignedTo) {
      if (!Array.isArray(req.body.assignedTo)) {
        return res
          .status(400)
          .json({ message: "assignedTo must be an array of user IDs " });
      }
      task.assignedTo = req.body.assignedTo;
    }

    const updatedTask = await task.save();
    res.json({ message: "Task updated successfully", updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//@desc Update task status
//@route PUT /api/tasks/:id/status
// @access Private
const updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    console.log("task.assignedTo:", task.assignedTo);
    console.log("req.user._id:", req.user._id.toString());

    // console.log("req.user:", req.user);

    const isAssigned =
      Array.isArray(task.assignedTo) &&
      task.assignedTo.some(
        (userId) => userId.toString() === req.user._id.toString()
      );

    const isOwner = task.createdBy.toString() === req.user._id.toString();

    if (!isAssigned && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    task.status = req.body.status || task.status;

    if (task.status === "Completed") {
      task.todoChecklist.forEach((item) => (item.completed = true));
      task.progress = 100;
    }

    await task.save();
    res.json({ message: "Task status updated", task });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//@desc Update task checklist
//@route PUT /api/tasks/:id/todo
// @access Private
const updateTaskChecklist = async (req, res) => {
  try {
    const { todoChecklist } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    if (!task.assignedTo.includes(req.user._id) && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to update checklist" });
    }

    task.todoChecklist = todoChecklist; //Replace with updated checklist

    //Auto update progress based on checklist completion
    const completedCount = task.todoChecklist.filter(
      (item) => item.completed
    ).length;
    const totalItems = task.todoChecklist.length;
    task.progress =
      totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

    //Auto-mark task as completed if all items are checked
    if (task.progress === 100) {
      task.status = "Completed";
    } else if (task.progress > 0) {
      task.status = "In-progress";
    } else {
      task.status = "Pending";
    }

    await task.save();
    const updatedTask = await Task.findById(req.params.id).populate(
      "assignedTo",
      "name email profileImageUrl"
    );

    res.json({ message: "Task checklist updated", task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/* //@desc Dashboard Data (Admin only)
//@route GET /api/tasks/Dashboard-data
// @access Private
const getDashboardData = async (req, res) => {
  try {
  //Fetch statistics
  const totalTasks =await Task.countDocuments();
  const pendingTasks = await Task.countDocuments( { status: "Pending" });
  const completedTasks = await Task.countDocuments( { status: "Completed" });
  const overdueTasks = await Task.countDocuments( { 
  status: { $ne: "Completed" },
  dueDate: { $lt: new Date()},
});

//Ensure all possible statuses are included
const taskStatuses = ["Pending", "In-progress", "Completed"];
const taskDistributionRaw = await Task.aggregate ([
  {
  $group: {
  _id: "$status",
  count: { $sum: 1},
  },
  },
]);

const taskDistribution = taskStatuses.reduce((acc, status) => {
  const formattedKey = status.replace(/\s+/g, "" ); //Remove spaces for response keys
  acc[formattedKey] = taskDistributionRaw.find((item)=> item._id === status) ? .count || 0;
  return acc;
  }, {});
  taskDistribution["All"] = totalTasks;  //Add total count to taskDistribution

  //Ensure all priority levels are included
  const taskPriorities = ["Low", "Medium", "High"];
  const taskPriorityLevelsRaw = await Task.aggregate([
  {
    $group: {
    _id: "$priority",
    count: { $sum: 1},
    },
  },
  ]);

  const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
    acc[priority] = taskPriorityLevelsRaw.find((item) => item._id === priority) ?.count || 0;
    return acc;
    }, {});

    //Fetch recent 10 tasks
    const recentTasks = await Task.find().sort({ createdAt: -1}).limit(10).select("title status priority dueDate createdAt");

    res.status(200).json({
    statistics: {
      totalTasks, pendingTasks, completedTasks, overdueTasks,
    },
    charts: {
      taskDistribution, taskPriorityLevels,
    },
    recentTasks,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }};
*/

// @desc Dashboard Data (User-specific)
//@route GET /api/tasks/user-dashboard-data
// @access Private
const getUserDashboardData = async (req, res) => {
  try {
    console.log("🔵 Hitting dashboard-data controller");
    const userId = req.user._id; //Only fetch for the logged-in user

    console.log("🔐 User in dashboard route:", req.user);

    //Fetch statistics for user-specific tasks
    const totalTasks = await Task.countDocuments({ assignedTo: userId });
    const pendingTasks = await Task.countDocuments({
      assignedTo: userId,
      status: "Pending",
    });
    const completedTasks = await Task.countDocuments({
      assignedTo: userId,
      status: "Completed",
    });
    const overdueTasks = await Task.countDocuments({
      assignedTo: userId,
      status: { $ne: "Completed" },
      dueDate: { $lt: new Date() },
    });

    //Task distribution by status
    const taskStatuses = ["Pending", "In-progress", "Completed"];
    const taskDistributionRaw = await Task.aggregate([
      { $match: { assignedTo: userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const taskDistribution = taskStatuses.reduce((acc, status) => {
      const formattedKey = status.replace(/\s+/g, "");
      acc[formattedKey] =
        taskDistributionRaw.find((item) => item._id === status)?.count || 0;
      return acc;
    }, {});
    taskDistribution["All"] = totalTasks;

    //Task distribution by priority
    const taskPriorities = ["Low", "Medium", "High"];
    const taskPriorityLevelsRaw = await Task.aggregate([
      { $match: { assignedTo: userId } },
      { $group: { _id: "$priority", count: { $sum: 1 } } },
    ]);

    const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
      acc[priority] =
        taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
      return acc;
    }, {});

    //Fetch recent 10 tasks for the logged-in user
    const recentTasks = await Task.find({ assignedTo: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title status priority dueDate createdAt");

    res.status(200).json({
      statistics: {
        totalTasks,
        pendingTasks,
        completedTasks,
        overdueTasks,
      },
      charts: {
        taskDistribution,
        taskPriorityLevels,
      },
      recentTasks,
    });
  } catch (error) {
    console.error("❌ Error in getUserDashboardData:", error);

    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskChecklist,
  getUserDashboardData,
};
