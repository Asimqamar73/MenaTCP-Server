import mongoose from "mongoose";

const adminSchema = mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  timestamp: { type: Date, required: true },
});

export default mongoose.model("Admin", adminSchema);
