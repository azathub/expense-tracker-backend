// middleware/auth.js
import jwt from "jsonwebtoken";
import { User } from "../models/index.js"; // <-- You must import the User model

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user by ID and attach it to the request object
      req.user = await User.findByPk(decoded.id);

      // Call next middleware
      next();
    } catch (error) {
      // Handle token verification errors
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    // Handle case where no token is provided
    res.status(400).json({ message: "Not authorized, no token" });
  }
};
