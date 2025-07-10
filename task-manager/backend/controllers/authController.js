const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

//@desc    Signup a new user
//@route   POST /api/auth/signup
//@access  Public
const signupUser = async (req, res) => {
  try {
    console.log("Signup request received");
    const { name, email, password, profileImageUrl, adminInviteToken } =
      req.body;
      

      console.log("Received data:", req.body); 
    //Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already Exists" });
    }

    //Determine user role: Admin if correct token is provided, otherwise member
    // let role = "member";
    // if (
    //   adminInviteToken &&
    //   adminInviteToken == process.env.ADMIN_INVITE_TOKEN  //if we are  giving admin, then we need to declare this ADMIN_INVITE_TOKEN in .env
    // ) {
    //   role = "admin";
    // }

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    //Create new user
    const user = await User.create({
      name,
      email,
      password: hashPassword,
      profileImageUrl, // i didnot pass role as a property here since i want to role to be its default value that is 'member', but if i want to use admin in future
      // i need to pass 'role' and also add uncommented role verification above.
    });

    //Return user data with JWT
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImageUrl: user.profileImageUrl,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//@desc     Login user
//@route    POST /api/auth/login
//@access   Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log("LOGIN REQUEST BODY:", req.body); //for testing gives post login details

    const user = await User.findOne({ email });
    // console.log("User found:", user); //for testing whether user is there or not

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    //Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    //Return user data with JWT
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImageUrl: user.profileImageUrl,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//@desc     Get user Profile
//@route    GET /api/auth/profile
//@access   Private (Requires JWT)
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//@desc     Update user Profile
//@route    PUT /api/auth/profile
//@access   Private (Requires JWT)
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { signupUser, loginUser, getUserProfile, updateUserProfile };
