import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';

import User from '../models/user.model.mjs';

export const verifyToken = asyncHandler(async (request, response, next) => {
  const token = request.cookies.token;

  if (!token) {
    return response.status(401).json({
      success: false,
      message: "Token not found",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    request.user = await User.findById(decoded._id).select("-password");
    next();
  } catch (err) {
    console.error(err);
    return response.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
});
