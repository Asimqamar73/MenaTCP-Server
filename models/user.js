import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  // message: { type: String },
  mobileNumber: { type: String },
  address: { type: String },
  gender: { type: String },
  city: { type: String },
  state: { type: String },
  zipCode: { type: String },
  country: { type: String },
  dateOfBirth: { type: String },
  profileImage: { type: String },
  coverImage: { type: String },
  followers: { type: Array, default: [] },
  following: { type: Array, default: [] },
  deleted: {type: Boolean, default: false}
});

export default mongoose.model("User", userSchema);
