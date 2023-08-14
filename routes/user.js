import express from "express";
import {
  signIn,
  signUp,
  getUser,
  getAllUsers,
  updateProfileImage,
  userprofileAPI,
  getOtherUser,
  forgotPassword,
  resetPassword,
  checkToken,
  searchForUsers,
  deleteUser,
  deleteUserAccount,
} from "../controllers/user.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();
router.post("/signin", signIn);
router.post("/signup", signUp);
router.get("/user", auth, getUser);
router.get("/users", auth, getAllUsers);

router.get("/search-by-name/:query", searchForUsers);
router.get("/user/:id", auth, getOtherUser);
router.patch("/update-profile-image", auth, updateProfileImage);
router.patch("/updateUserProfileAPI", userprofileAPI);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword", resetPassword);
router.post("/checkToken", checkToken);
// router.post("/contactProfileAPI/:id", contactProfileAPI);
router.delete("/deleteUser/:id", deleteUser);
router.delete("/deleteAccount/:id", deleteUserAccount)

export default router;
