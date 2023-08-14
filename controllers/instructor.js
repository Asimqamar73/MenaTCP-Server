import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Instructor from "../models/instructor.js";
import User from "../models/user.js";

export const instructorLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingInstructor = await Instructor.findOne({ email });

    if (!existingInstructor) {
      return res.status(404).json({ message: "User doesn't exist." });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingInstructor.password
    );

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid Password" });

    const token = jwt.sign(
      { email: existingInstructor.email, id: existingInstructor._id },
      process.env.SECRET
    );
    res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const emptyInstructor = async (req, res) => {
  res.status(200).json([]);
};

export const getAllInstructors = async (req, res) => {
  try {
    const instructors = await Instructor.find();
    res.status(200).json(instructors);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

export const addInstructor = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const existingInstructor = await Instructor.findOne({ email });
    if (existingInstructor)
      return res
        .status(400)
        .json({ message: "Instructor with this Email already exists." });

    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res
        .status(400)
        .json({ message: "User with this Email already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newInstructor = await Instructor.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      timestamp: Date.now(),
    });

    const result = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    res.status(200).json({ newInstructor, result });
  } catch (error) {
    console.log("ERROR ", error);
    res.status(500).json({ message: error });
  }
};
export const getInstructorByName = async (req, res) => {
  try {
    const { query } = req.params;

    const instructors = await Instructor.find({
      name: { $regex: query, $options: "i" },
    }).limit(10);

    res.status(200).json(instructors);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};
export const updateInstructor = async (req, res) => {
  try {
    const { id } = req.params;
    const { instructorFirstName, instructorLastName, instructorEmail } =
      req.body;

    const s = await Instructor.findByIdAndUpdate(id, {
      firstName: instructorFirstName,
      lastName: instructorLastName,
      email: instructorEmail,
    });
    res.status(200).json({ message: "Updated Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

export const deleteInstructor = async (req, res) => {
  try {
    const { id } = req.params;
    const del = await Instructor.findByIdAndDelete(id);
    res.status(200).json({ del });
  } catch (error) {
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

export const getInstructorById = async (req, res) => {
  try {
    const { id } = req.params;

    const instructorName = await Instructor.findById(id);
    res.status(200).json(instructorName);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};
