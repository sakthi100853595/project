const Task = require("../models/Task");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

//@desc Get all users (Admin only)
//@route GET /api/users/
//@access Private (Admin)
const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "member" }).select("-password");
    //Add task counts to each user
    const userWithTaskCounts = await Promise.all(
      users.map(async (user) => {
        const pendingTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "pending",
        });
        const inProgressTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "In-Progress",
        });
        const completedTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "Completed",
        });

        return {
          ...user._doc, //Include all existing user data
          pendingTasks,
          inProgressTasks,
          completedTasks,
        };
      })
    );

    res.json(userWithTaskCounts);
  } catch (error) {
    res.stauts(500).json({ message: "Server error", error: error.message });
  }
};

//@desc Get user by ID
//@route GET /api/users/:id
//@access Private
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.stauts(500).json({ message: "Server error", error: error.message });
  }
};

//@desc delete a user (admin only)
//@route DELETE /api/users/:id
//@access Private (admin)
// const deleteUser = async (req, res) => {
//  try {
//   } catch (error) {
//     res.stauts(500).json({ message: "Server error", error: error.message });
//   }
// };

//for admin, add getUsers, deleteUser in the export and uncomment the same

module.exports = { getUsers, getUserById };
