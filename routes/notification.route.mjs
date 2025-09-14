import express from 'express';

import {
  createNotification,
  getMyNotifications,
  markAsRead,
} from '../controllers/notification.controller.mjs';
import { verifyToken } from '../middlewares/auth.middleware.mjs';
import { checkRole } from '../middlewares/role.middleware.mjs';

const notificationRouter = express.Router();


notificationRouter.post("/", verifyToken, checkRole("admin"), createNotification);
notificationRouter.get("/", verifyToken, getMyNotifications);
notificationRouter.put("/:id/read", verifyToken, markAsRead);

export default notificationRouter;
