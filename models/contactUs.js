import mongoose from "mongoose";

const contactUsSchema = mongoose.Schema({
  creatorId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, default: " " },
  message: { type: String, default: " " },
  timestamp: { type: Date, default: Date.now() },
});

export default mongoose.model("ContactUs", contactUsSchema);
