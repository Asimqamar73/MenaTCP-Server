let SOCKETS = {};

export const addUser = (userId, socketId) => {
  SOCKETS[userId] = socketId;
  return SOCKETS;
};

export const removeUser = (socketId) => {
  const userId = Object.keys(SOCKETS).find((key) => SOCKETS[key] === socketId);

  delete SOCKETS[userId];
  return SOCKETS;
};

export const getUser = (userId) => {
  const socketId = SOCKETS[userId];
  return socketId;
};
