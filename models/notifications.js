import mongoose from "mongoose";

const notificationsSchema = mongoose.Schema({
  senderId: { type: String, required: true },
  recieverId: { type: String, required: true },
  postId: { type: String, required: true },
  is_read: { type: Boolean, required: true },
  Type: { type: String, required: true }, // like/comment/share
});
export default mongoose.model("Notifications", notificationsSchema);
