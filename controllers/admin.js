import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/admin.js";
import Instructor from "../models/instructor.js";

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingAdmin = await Admin.findOne({ email });

    if (!existingAdmin) {
      return res.status(404).json({ message: "Invalid credentials." });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingAdmin.password
    );

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid Password" });

    const token = jwt.sign(
      { email: existingAdmin.email, id: existingAdmin._id },
      process.env.SECRET
    );
    res.status(200).json({ result: existingAdmin, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const createAccount = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin)
      return res.status(400).json({ message: "User already exists." });

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await Admin.create({
      name,
      email,
      password: hashedPassword,
      timestamp: Date.now(),
    });

    const token = jwt.sign(
      { email: result.email, id: result._id },
      process.env.SECRET
    );
    res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong." });
  }
};
export const getAllAdmin = async (req, res) => {
  try {
    const data = await Admin.find().select("name email timestamp");

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const getAdminDetails = async (req, res) => {
  try {
    let admin = await Admin.findById(req.userId);
    if (admin) {
      return res.status(200).json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        type: "admin",
      });
    }

    const instructor = await Instructor.findById(req.userId);

    if (instructor) {
      return res.status(200).json({
        _id: instructor._id,
        name: instructor.name,
        email: instructor.email,
        type: "instructor",
      });
    }

    return res
      .status(404)
      .json({ message: "User with given id doesnt exist." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong." });
  }
};
