const jwt = require("jsonwebtoken");
const User = require("../models/User");

//Middleware to protect routes
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    let token;

    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1]; //Extract Token from Bearer <token>
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      //newly added
      console.log("Decoded Token:", decoded);
      if (!decoded.id) {
        return res
          .status(400)
          .json({ message: "Invalid token payload (missing id)" });
      }

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(404).json({ message: "User not found" });
      }
      //newly added
      console.log("Authenticated User:", req.user);

      next();
    } else {
      res.status(401).json({ message: "Not authorized, no token" });
    }
  } catch (error) {
    res.status(401).json({ message: "Token failed", error: error.message });
  }
};

//Middleware for Admin-only access
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied, admin only" });
  }
};

// module.exports = { protect, adminOnly};

module.exports = { protect, adminOnly };
