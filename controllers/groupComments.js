import groupComments from "../models/groupComments.js";
// import post from "../models/post.js";
import groupPost from "../models/groupPost.js";
import Notifications from "../models/notifications.js";
//create,  delete, display

export const createGroupComment = async (req, res) => {
  try {
    const { postId, creatorId, commentMessage } = req.body;
    //find post
    const existingPost = await groupPost.findById(postId);

    if (!existingPost) {
      console.log("SECOND createGroupComment");
      return res.status(404).json({ message: "Post doesn't exist." });
    }
    //create Comment
    const newComment = await groupComments.create({
      creatorId,
      postId,
      commentMessage,
      timestamp: Date.now(),
    });
    let newNotifications;
    if (newComment) {
      const postData = await groupPost.findById(postId);
      const newNotifications = await Notifications.create({
        senderId: creatorId,
        recieverId: postData.creatorId,
        is_read: false,
        postId: postId,
        Type: "comment",
      });
    }
    res.status(200).json(newComment);
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
};
export const deleteGroupComment = async (req, res) => {
  try {
    const { commentId, creatorId, postId } = req.body;

    //checking Post availability
    const existingPost = await groupPost.findById(postId);

    if (!existingPost) {
      return res.status(404).json({ message: "Post doesn't exist." });
    }

    //checking comment availability
    const existingComment = await groupComments.findById(commentId);
    if (!existingComment) {
      return res.status(404).json({ message: "Comment doesn't exist." });
    }

    //deleteing comment

    const deleteResult = await groupComments.findByIdAndDelete(commentId);
    res.status(200).json(deleteResult);
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
};

export const fetchAllGroupComments = async (req, res) => {
  try {
    const { id } = req.params;
    const commentsResult = await groupComments.find({ postId: id });
    res.status(200).json(commentsResult);
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
};
