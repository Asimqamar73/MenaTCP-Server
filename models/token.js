import mongoose from "mongoose";

const tokenSchema = mongoose.Schema({
  userEmail: { type: String, required: true },
  token: { type: String, required: true, unique: true },
  expire: {
    type: Date,
    default: Date.now,
    expires: 3600,
  },
});

export default mongoose.model("Token", tokenSchema);
