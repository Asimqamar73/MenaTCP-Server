import mongoose from "mongoose";

const instructorSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  timestamp: { type: Date, default: Date.now() },
});

export default mongoose.model("Instructor", instructorSchema);
