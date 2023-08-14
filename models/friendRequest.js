import mongoose from "mongoose";

const friendRequestSchema = mongoose.Schema({
  sender: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  receiver: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now() },
});

export default mongoose.model("FriendRequest", friendRequestSchema);
