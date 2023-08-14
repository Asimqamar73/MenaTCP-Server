import mongoose from "mongoose";
const groupMemberSchema = mongoose.Schema({
  groupId: { type: String, required: true },
  groupMemberId: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "accepted"],
    default: "pending",
  },
});
export default mongoose.model("groupMember", groupMemberSchema);
