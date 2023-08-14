import mongoose from "mongoose";

const eventSchema = mongoose.Schema({
  timestamp: { type: Date, default: Date.now() },
  creatorId: { type: String, required: true },
  image: { type: String, required: true },
  // selectedTime: { type: String, required: true },
  selectedDate: { type: String, required: true },
  eventName: { type: String, required: true },
  eventDescription: { type: String, required: true },
});

export default mongoose.model("Event", eventSchema);
