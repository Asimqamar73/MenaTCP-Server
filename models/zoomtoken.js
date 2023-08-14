import mongoose from "mongoose";

const zoomSchema = mongoose.Schema({
  zoomAccessToken: { type: String, required: true },
  zoomRefreshToken: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Zoomtoken", zoomSchema);
