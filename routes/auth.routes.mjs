import express from 'express';

import {
  forgotPassword,
  login,
  logout,
  profile,
  register,
  resetPassword,
  updateProfile,
} from '../controllers/auth.controller.mjs';
import { verifyToken } from '../middlewares/auth.middleware.mjs';
import upload from '../middlewares/multer.middleware.mjs';

const authRouter = express.Router();


authRouter.post("/register", upload.single("profileImg"), register);
authRouter.post("/login", login);
authRouter.post("/forgotPassword", forgotPassword);
authRouter.post("/resetPassword/:token", resetPassword);
authRouter.post("/logout", logout)
authRouter.get("/profile", verifyToken, profile);
authRouter.put("/update-profile", verifyToken, updateProfile);

export default authRouter