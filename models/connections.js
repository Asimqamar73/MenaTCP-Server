import mongoose from "mongoose";

const connectionsSchema = mongoose.Schema({
  users: { type: Array, required: true },
  creatorId: { type: String, required: true },
  receiverId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now(), required: true },
  status: {
    type: String,
    enum: ["pending", "accepted"],
    default: "pending",
  },
});
export default mongoose.model("Connections", connectionsSchema);
