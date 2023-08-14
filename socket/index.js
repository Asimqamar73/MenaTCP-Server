import { createServer } from "http";
import { Server } from "socket.io";
import { sendMessage } from "./message.js";
import { addUser, getUser, removeUser } from "./user.js";

const socketInit = (app) => {
  const server = createServer(app);

  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
    },
  });

  io.on("connection", (socket) => {
    console.log(
      `[SOCKET]:  A NEW USER CONNECTED TO SOCKET SERVER WITH SOCKET ID: ${socket.id}`
    );

    socket.on("addUser", (userId) => {
      console.log(
        `[SOCKET]:  A USER WITH ID: ${userId} TO SOCKET SERVER WITH SOCKET ID: ${socket.id}`
      );
      const users = addUser(userId, socket.id);
      io.emit("getUsers", users);
    });

    socket.on("disconnect", () => {
      console.log(
        `[SOCKET]:  A USER DISCONNECTED FROM SOCKET SERVER WITH SOCKET ID: ${socket.id}`
      );
      const users = removeUser(socket.id);
      io.emit("getUsers", users);
    });

    socket.on("message", (msg, callBack) => {
      console.log(
        `[SOCKET]:  A USER WITH SOCKET ID: ${socket.id} SENT MESSAGE: ${msg.message}`
      );
      sendMessage(msg, socket, io, callBack);
    });
  });

  return { server, io };
};

export default socketInit;
