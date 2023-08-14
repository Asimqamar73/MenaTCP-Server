import mongoose from "mongoose";

// const categorySchema = mongoose.Schema({
//   categoryName: { type: String, required: true, unique: true },
//   timestamp: { type: Date, default: Date.now() },
// });

const categorySchema = mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: [true, "Please enter category name"],
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Category", categorySchema);
