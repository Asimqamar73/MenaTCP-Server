import Chat from "../models/chat.js";
import User from "../models/user.js";
import Message from "../models/message.js";

export const getChatsForUser = async (req, res) => {
  try {
    let chats = await Chat.find({
      users: { $regex: req.userId, $options: "i" },
    }).sort({ timestamp: -1 });

    chats = chats.map(async (chat) => {
      const userId =
        chat.users[0] == req.userId ? chat.users[1] : chat.users[0];
      const user = await User.findById(userId);
      return {
        userId,
        image: user?.profileImage ? user?.profileImage : "",
        name: `${user?.firstName} ${user?.lastName}`,
        last: chat.last,
        timestamp: chat.timestamp,
        lastSender: chat.lastSender,
        _id: chat._id,
      };
    });

    Promise.all(chats).then((values) => {
      res.status(200).json(values);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const getChat = async (req, res) => {
  try {
    const { userId } = req.params;

    let chat = await Chat.findOne({ users: { $all: [userId, req.userId] } });

    if (!chat) {
      chat = await Chat.create({
        users: [req.userId, userId],
        chatType: "single",
        last: "Start Sending Messages",
        timestamp: Date.now(),
      });
    }

    const user = await User.findById(userId).select("firstName profileImage");

    res.status(200).json({
      id: chat._id,
      firstName: user.firstName,
      image: user?.profileImage ? user?.profileImage : "",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const addChat = async (req, res) => {
  try {
    const { id } = req.params;

    const { userId, chatType } = req.body;

    let chat = await Chat.create({
      users: [id, userId],
      chatType,
      last: "Start Sending Messages",
      time: Date.now(),
    });

    res.status(200).json(chat);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const deleteChats = async (req, res) => {
  try {
    const chats = await Chat.find();

    chats.map(async (element) => {
      const s = await Chat.findByIdAndDelete(element._id);
    });

    res.status(200).json(chats);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const getChatsByName = async (req, res) => {
  try {
    const { query } = req.params;

    const users = await User.find({
      firstName: { $regex: query, $options: "i" },
    }).select("firstName lastName profileImage");

    let chats = users.map(async (user) => {
      const chat = await Chat.findOne({
        users: { $all: [user._id.toString(), req.userId] },
      });

      if (chat) {
        return {
          userId: user._id,
          image: user?.profileImage ? user?.profileImage : "",
          name: `${user?.firstName} ${user?.lastName}`,
          last: chat ? chat.last : "Start Sending Messages",
          timestamp: chat ? chat.timestamp : Date.now(),
          lastSender: chat ? chat.lastSender : "",
          _id: chat ? chat._id : "",
        };
      }
    });

    Promise.all(chats).then((values) => {
      let result = [];
      values.map((value) => {
        if (value) result.push(value);
      });

      res.status(200).json(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};
