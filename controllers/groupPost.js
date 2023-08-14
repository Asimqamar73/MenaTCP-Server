import GroupPost from "../models/groupPost.js";

export const createGroupPost = async (req, res) => {
  try {
    const { text, image, groupId, pdfs } = req.body;

    const newGroupPost = await GroupPost.create({
      text,
      pdfName: pdfs.pdfName,
      pdfFile: pdfs.pdfFile,
      image,
      creatorId: req.userId,
      groupId,
      timestamp: Date.now(),
    });
    res.status(200).json(newGroupPost);
  } catch (err) {
    console.log("ERROR : ", err.message);
    res.status(500).json({ message: err });
  }
};

export const getAllGroupPostsById = async (req, res) => {
  try {
    const { groupId } = req.params;
    console.log("GroupPost", groupId);
    const groupPosts = await GroupPost.find({ groupId }).sort({
      timestamp: -1,
    });
    res.status(200).json(groupPosts);
  } catch (err) {
    console.log("ERROR: ", err);
    res.status(500).json({ message: err });
  }
};
export const getGroupPostById = async (req, res) => {
  const { postId } = req.params;
  console.log("Share hu me", postId);
  try {
    const post = await GroupPost.findById(postId);
    if (!post) {
      res.status(404).json({ message: "Post doesn't exist" });
      return;
    }
    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const deleteGroupPostById = async (req, res) => {
  const { id } = req.params;

  try {
    const existingPost = await GroupPost.findById(id);
    if (!existingPost)
      return res.status(400).json({ message: "Post doesn't exists" });
    await GroupPost.findByIdAndDelete(id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

export const getAllGroupPosts = async (req, res) => {
  try {
    const groups = await GroupPost.find().sort({ timestamp: -1 });
    res.status(200).json(groups);
  } catch (err) {
    console.log("ERROR :", err);
    res.status(500).json({ message: err });
  }
};

export const getGroupPostsByName = async (req, res) => {
  try {
    const { query } = req.params;
    let groupsResult;

    groupsResult = await GroupPost.find({
      title: { $regex: query, $options: "i" },
    });

    res.status(200).json(groupsResult);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};
export const likedGroupPosts = async (req, res) => {
  const { postId, userId } = req.body;
  try {
    const existingPost = await GroupPost.findById(postId);
    if (!existingPost) res.status(404).json({ message: "Post doesn't exists" });

    let bool = false;
    existingPost.likes.map((item) => {
      if (item == userId) {
        bool = true;
      }
    });
    if (!bool) {
      existingPost.likes.push(userId);
      existingPost.save();
    }

    res.status(200).json({ message: "Done" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};
export const shareGroupPost = async (req, res) => {
  try {
    const { text, postId, groupId } = req.body;
    console.log("Share reqbody", req.body);

    const newPost = await GroupPost.create({
      text,
      groupId,
      sharedId: postId,
      creatorId: req.userId,
      timestamp: Date.now(),
    });
    res.status(200).json(newPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};
