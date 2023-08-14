import mongoose from "mongoose";

const pdfSchema = mongoose.Schema({
  lessonId: { type: String, required: true },
  pdfName: { type: String, required: true },
  pdfSrc: { type: String, required: true },
  timestamp: { type: Date, default: Date.now(), required: true },

});

export default mongoose.model("pdf", pdfSchema);