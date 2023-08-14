import Comments from "../models/comments.js";
import post from "../models/post.js";
import Notifications from "../models/notifications.js";
//create,  delete, display

export const createComment = async (req, res) => {
  try {
    const { postId, creatorId, commentMessage } = req.body;
    //find post
    const existingPost = await post.findById(postId);

    if (!existingPost) {
      return res.status(404).json({ message: "Post doesn't exist." });
    }
    //create Comment
    const newComment = await Comments.create({
      creatorId,
      postId,
      commentMessage,
      timestamp: Date.now(),
    });
    let newNotifications;
    if (newComment) {
      const postData = await post.findById(postId);
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
export const deleteComment = async (req, res) => {
  try {
    const { commentId, creatorId, postId } = req.body;

    //checking Post availability
    const existingPost = await post.findById(postId);

    if (!existingPost) {
      return res.status(404).json({ message: "Post doesn't exist." });
    }

    //checking comment availability
    const existingComment = await Comments.findById(commentId);
    if (!existingComment) {
      return res.status(404).json({ message: "Comment doesn't exist." });
    }

    //deleteing comment

    const deleteResult = await Comments.findByIdAndDelete(commentId);
    res.status(200).json(deleteResult);
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
};

export const fetchAllComments = async (req, res) => {
  try {
    const { id } = req.params;
    const commentsResult = await Comments.find({ postId: id });
    res.status(200).json(commentsResult);
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
};

export const createGroupComment = async (req, res) => {
  try {
    const { postId, creatorId, commentMessage } = req.body;
    //find post
    const existingPost = await GroupPost.findById(postId);

    if (!existingPost) {
      return res.status(404).json({ message: "Post doesn't exist." });
    }
    //create Comment
    const newComment = await Comments.create({
      creatorId,
      postId,
      commentMessage,
      timestamp: Date.now(),
    });
    let newNotifications;
    if (newComment) {
      const postData = await post.findById(postId);
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
