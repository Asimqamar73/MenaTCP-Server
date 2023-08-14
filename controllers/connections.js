import Connections from "../models/connections.js";
import Users from "../models/user.js";

// send a connection to another user
export const createConnection = async (req, res) => {
  try {
    const { receiver } = req.body;

    if (req.userId === receiver) {
      return res
        .status(400)
        .json({ message: "You can't connect with yourself" });
    }
    // Check if the users are already in a connection
    const existingConnection = await Connections.findOne({
      users: { $all: [req.userId, receiver] },
    });

    if (existingConnection) {
      return res.status(400).json({ message: "Connection already exists" });
    }

    const connection = await Connections.create({
      creatorId: req.userId,
      receiverId: receiver,
      users: [req.userId, receiver],
      createdAt: Date.now(),
      status: "pending",
    });

    res.status(201).json(connection);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create connection" });
  }
};

// get one connection
export const getConnections = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const existingConnection = await Connections.findOne({
      users: { $all: [req.userId, id] },
    });
    res.status(200).json(existingConnection);
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
};

// get all connectionsRequests by id

export const getConnectionById = async (req, res) => {
  try {
    const getConnection = await Connections.find({
      receiverId: [req.userId],
      status: "pending",
    });
    res.status(200).json(getConnection);
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
};

//delete a connection
export const deleteConnection = async (req, res) => {
  const { id } = req.params;

  try {
    const deleteResult = await Connections.findById(id);
    if (!deleteResult)
      return res.status(400).json({ message: "Friend Request doesn't exists" });
    await Connections.findByIdAndDelete(id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
    console.log(error);
  }
};

// confrom a connection to another user
export const acceptConnection = async (req, res) => {
  const { creatorId, receiverId } = req.body;
  console.log("creatorId", creatorId);
  console.log("receiverId", receiverId);

  try {
    const connection = await Connections.findOneAndUpdate(
      { creatorId, receiverId, status: "pending" },
      { $set: { status: "accepted" } },
      { new: true }
    );
    console.log("Its Here", connection);
    if (!connection) {
      return res
        .status(404)
        .json({ message: "Friend request not found or already accepted" });
    }

    res.status(200).json(connection);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
    console.log(error);
  }
};

// get all confirmed connections

export const getConfirmedConnections = async (req, res) => {
  try {
    const getConfirmedConnections = await Connections.find({
      status: "accepted",
      users: { $all: [req.userId] },
    }).select("users");
    console.log("getConfirmedConnections ::", getConfirmedConnections);
    let users = [];

    for (let i = 0; i < getConfirmedConnections.length; i++) {
      console.log("LOOP ", i);
      let user;

      for (let j = 0; j < getConfirmedConnections[i].users.length; j++) {
        if (getConfirmedConnections[i].users[j] !== req.userId) {
          user = await Users.findById(
            getConfirmedConnections[i].users[j]
          ).select("firstName lastName profileImage");
        }
      }

      users.push(user);
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
};
//  users: { $all: [req.params.username] },
