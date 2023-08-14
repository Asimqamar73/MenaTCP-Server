import mongoose from "mongoose";

const zoomTokenSTSSchema = mongoose.Schema({
  access_token: { type: String, required: true },
  expires_in: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("ZoomTokenSTS", zoomTokenSTSSchema);
