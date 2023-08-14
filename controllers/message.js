import Message from "../models/message.js";

export const getFullChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    let messages = await Message.find({ chatId });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
    console.log(error);
  }
};
