import Admin from "../models/admin.js";

export const adminAuth = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.userId);
    
    if (!admin)
    return res.status(401).json({
      message: "You don't have the permission to perform this action",
    });
    
    next();
  } catch (error) {
    console.log("error: ", error);
  }
};
