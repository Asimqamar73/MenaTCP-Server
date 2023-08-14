import Message from "../models/message.js";
import Chat from "../models/chat.js";
import { getUser } from "./user.js";

export const sendMessage = async (msg, socket, io, callBack) => {
  const message = await Message.create({
    chatId: msg.chatId,
    senderId: msg.senderId,
    message: msg.message,
    timestamp: Date.now(),
  });

  let chat = await Chat.findByIdAndUpdate(
    msg.chatId,
    {
      lastSender: msg.senderId,
      last: msg.message,
      timestamp: Date.now(),
    },
    { new: true }
  );
  callBack(true);

  chat.users.map((user) => {
    io.to(getUser(user)).emit("reply", { chat, message });
  });
};
