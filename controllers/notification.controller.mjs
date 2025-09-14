import asyncHandler from 'express-async-handler';

import Notification from '../models/notification.model.mjs';

/**
 * @route   POST /api/v1/notifications
 * @desc    Create a notification
 * @access  Private (Admin / System Trigger)
 */
export const createNotification = asyncHandler(async (req, res) => {
  const { user, title, message } = req.body;

  const notification = await Notification.create({ user, title, message });

  res.status(201).json({
    message: "Notification created successfully",
    success: true,
    data: notification,
  });
});

/**
 * @route   GET /api/v1/notifications
 * @desc    Get notifications for logged-in user
 * @access  Private
 */
export const getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });

  res.status(200).json({
    message: "Notifications retrieved successfully",
    success: true,
    data: notifications,
  });
});

/**
 * @route   PUT /api/v1/notifications/:id/read
 * @desc    Mark a notification as read
 * @access  Private
 */
export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findByIdAndUpdate(
    req.params.id,
    { isRead: true },
    { new: true }
  );

  if (!notification) {
    return res.status(404).json({ message: "Notification not found", success: false });
  }

  res.status(200).json({
    message: "Notification marked as read",
    success: true,
    data: notification,
  });
});
