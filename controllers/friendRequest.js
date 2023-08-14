import friendRequest from "../models/friendRequest.js";
export const sendFriendRequest = async (req, res) => {
  const { sender, receiver } = req.body;

  try {
    const request = await friendRequest.create({ sender, receiver });
    res.status(201).json(request);
  } catch (error) {
    next(error);
  }
};

export const getFriendRequests = async (req, res) => {
  const { userId } = req.params;

  try {
    const requests = await friendRequest
      .find({ receiver: userId })
      .populate("sender");
    res.json(requests);
  } catch (error) {
    next(error);
  }
};
