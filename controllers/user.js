import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import groupMember from "../models/groupMember.js";
import Token from "../models/token.js";
import { randomBytes } from "crypto";
import { createTransport } from "nodemailer";
import { userDetailsString } from "../utils/constants.js";
import user from "../models/user.js";

export const signUp = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    const oldUser = await User.findOne({ email });

    if (oldUser)
      return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const result = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    const token = jwt.sign(
      { email: result.email, id: result._id },
      process.env.SECRET
    );
    res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const oldUser = await User.findOne({ email });
    if (!oldUser)
      return res.status(404).json({ message: "User doesn't exist" });
    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    await User.findByIdAndUpdate(oldUser._id, {deleted: false})
    const token = jwt.sign(
      { email: oldUser.email, id: oldUser._id },
      process.env.SECRET
    );
    res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(userDetailsString);

    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const user = await User.find().select(userDetailsString);

    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

export const getOtherUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select(userDetailsString);

    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

export const updateProfileImage = async (req, res) => {
  try {
    let form = req.body;

    const updatedUser = await User.findByIdAndUpdate(req.userId, form, {
      new: true,
    }).select(userDetailsString);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const userprofileAPI = async (req, res) => {
  try {
    const {
      id,
      firstName,
      lastName,
      gender,
      country,
      city,
      address,
      phoneNumber,
    } = req.body;

    const existingUser = await User.findById(id);

    if (!existingUser)
      return res.status(409).json({ message: "User doesn't exists" });

    if (firstName) {
      existingUser.firstName = firstName;
    }
    if (lastName) {
      existingUser.lastName = lastName;
    }
    if (gender) {
      existingUser.gender = gender;
    }
    if (country) {
      existingUser.country = country;
    }
    if (city) {
      existingUser.city = city;
    }
    if (address) {
      existingUser.address = address;
    }
    if (phoneNumber) {
      existingUser.mobileNumber = phoneNumber;
    }

    existingUser.save();

    res.status(200).json(existingUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    console.log('Its me here')
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = await Token.findOne({ userEmail: user.email });

    if (!token) {
      token = await Token.create({
        userEmail: user.email,
        token: randomBytes(2).toString("hex"),
      });
    }

    var transporter = createTransport({
      service: "gmail",
      auth: {
        user: "texinitytesting123@gmail.com",
        pass: "mqpcmviezbugpiaj",
      },
    });

    const mailOptions = {
      from: "texinitytesting123@gmail.com",
      to: user.email,
      subject: "Password Reset",
      html: `<h1>Password Rest Link</h1><p>The code for reseting your password is as follows: ${token.token}</p>`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.status(200).json({ message: "Email for password reset sent." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const checkToken = async (req, res) => {
  try {
    const { token, userEmail } = req.body;

    const tokenn = await Token.findOne({ token, userEmail });

    if (!tokenn) res.status(404).json({ message: "Token Invalid" });
    res.status(200).json({ message: "Token Valid" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email }).select("email");

    if (!user) return res.status(404).json({ message: "User doesn't exist." });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user = await User.findByIdAndUpdate(
      user._id,
      { password: hashedPassword },
      { new: true }
    );
    console.log("success");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const searchForUsers = async (req, res) => {
  try {
    const { query } = req.params;
    const { groupId } = req.query;
    console.log("query", query);

    let users = [];
    const first = await User.find({
      firstName: { $regex: query, $options: "i" },
    }).limit(10);

    const second = await User.find({
      lastName: { $regex: query, $options: "i" },
    }).limit(10);
    // users = [...first, ...second];
    // users = [...first];
    // console.log("users", users);
    const alreadyGroupMember = await groupMember.find({ groupId });
    // console.log(alreadyGroupMember);
    let result = [];

    first.map((user) => {
      if (!includes(alreadyGroupMember, user._id)) {
        result.push(user);
      }
    });

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

function includes(array, id) {
  for (let i = 0; i < array.length; i++) {
    if (array[i].groupMemberId == id) {
      return true;
    }
  }
  return false;
}

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const del = await User.findByIdAndDelete(id);
    if(!user){
      return res.status(404).json({ error:'User Not Found'})
    }
    res.status(200).json({ del });
  } catch (error) {
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

export const deleteUserAccount = async(req , res) =>{
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, {deleted: true});
    if(!user){
      return res.status(404).json({ error:'User Not Found'})
    }
    // await user.remove();
    return res.json({message:'Account Deleted Successfully'})
  } catch (error) {
    res.status(500).json({ message:'Something Went Wrong '})
  }
}