import mongoose from "mongoose";

const pushNotificationSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Please provide notification content"],
    },
    creator: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
export const PushNotification = mongoose.model(
  "pushNotification",
  pushNotificationSchema
);
