import Notifications from "../models/notifications.js";
import { PushNotification } from "../models/pushNotification.js";

export const fetchAllNotifications = async (req, res) => {
  try {
    const NotificationsResult = await Notifications.find({
      recieverId: req.userId,
    });

    res.status(200).json(NotificationsResult);
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
};

export const viewedNotification = async (req, res) => {
  const { id } = req.params;
  try {
    const NotificationsResult = await Notifications.findByIdAndUpdate(
      {
        recieverId: id,
      },
      {
        is_read: true,
      }
    );
    res.status(200).json(NotificationsResult);
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
};

export const sendNotificationToAll = async (req, res) => {
  try {
    req.body.creator = req.userId;
    const response = await PushNotification.create(req.body);
    console.log(response);
    req.io.emit("pushNotification", req.body.content);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const fetchNotifications = async (req, res) => {
  try {
    const notifications = await PushNotification.find({});
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json(error);
  }
};
