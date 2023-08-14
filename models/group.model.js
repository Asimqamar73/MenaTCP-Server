import mongoose from "mongoose";

const groupSchema = mongoose.Schema(
  {
    creatorId: { type: String, required: [true, "Please provide creator id."] },
    title: { type: String, required: [true, "please provide title."] },
    thumbnail: {
      type: String,
      required: [true, "Please provide group image."],
    },
    groupMembers: {
      ref: "groupMember",
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Group", groupSchema);
