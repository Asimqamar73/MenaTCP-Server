import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
  chatId: { type: String, required: true },
  senderId: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, required: true, default: Date.now() },
});

export default mongoose.model("Message", messageSchema);
