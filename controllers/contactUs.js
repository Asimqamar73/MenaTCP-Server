import ContactUs from "../models/contactUs.js";

export const contactProfileAPI = async (req, res) => {
  try {
    const { firstName, email, message } = req.body;

    const newPost = await ContactUs.create({
      creatorId: req.userId,
      name: firstName,
      email,
      message,
    });
    res.status(200).json(newPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await ContactUs.find();
    res.status(200).json(contacts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};
