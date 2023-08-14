import Post from "../models/post.js";
import User from "../models/user.js";
import Notifications from "../models/notifications.js";

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ timestamp: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

export const getPostById = async (req, res) => {
  const { postId } = req.params;
  console.log(postId, " postid");
  try {
    const post = await Post.findById(postId);
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

export const createPost = async (req, res) => {
  try {
    const { text, image } = req.body;

    const newPost = await Post.create({
      text,
      image,
      creatorId: req.userId,
      timestamp: Date.now(),
    });
    res.status(200).json(newPost);
  } catch (error) {
    console.log(error);
    res.status(200).json({ message: error });
  }
};

export const likedPosts = async (req, res) => {
  const { postId, userId } = req.body;
  try {
    const existingPost = await Post.findById(postId);
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

export const commentPosts = async (req, res) => {
  const { creatorId, userId, text } = req.body;
  try {
    const existingUser = await Post.findById(creatorId);
    if (!existingUser) res.status(404).json({ message: "User doesn't exists" });

    existingUser.comments.push({ userId, text });
    existingUser.save();

    res.status(200).json();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

export const getPostComments = async (req, res) => {
  const { creatorId } = req.body;
  try {
    const existingUser = await Post.findById(creatorId);
    if (!existingUser) res.status(404).json({ message: "User doesn't exists" });

    let com = existingUser.comments;
    let comment = com.map(async (c) => {
      const user = await User.findById({ _id: c.userId });
      return {
        id: c.userId,
        text: c.text,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImage: user.profileImage,
      };
    });

    Promise.allSettled(comment).then((values) => {
      comment = values.map(({ value }) => value);
      res.status(200).json(comment);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

export const followReq = async (req, res) => {
  const { userid, id } = req.body;
  try {
    const existingUser = await User.findById(userid);
    const user = await User.findById(id);

    if (!existingUser)
      return res.status(409).json({ message: "User doesn't exists" });

    if (!user) return res.status(409).json({ message: "User doesn't exists" });

    let follow = existingUser.followers;
    let bool = false;
    follow.map((item) => {
      if (item === id) {
        bool = true;
      }
    });

    if (!bool) {
      existingUser.followers.push(id);
      existingUser.save();
      user.following.push(userid);
      user.save();
      // if (newComment) {
      // const postData = await Post.findById(postId);
      // const newNotifications = await Notifications.create({
      //   senderId: creatorId,
      //   recieverId: postData.creatorId,
      //   is_read: false,
      //   postId: postId, // ab mein post id kaha sy lau ..
      //   Type: "comment",
      // });
      // }
    }
    res.status(200).json("done");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

export const userPosts = async (req, res) => {
  const { id } = req.body;
  try {
    const existingUser = await User.findById(id);
    const existingUserPosts = await Post.find({ creatorId: id });

    if (!existingUser)
      return res.status(409).json({ message: "User doesn't exists" });

    let result = {
      existingUser,
      existingUserPosts,
    };

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

export const getAllLikes = async (req, res) => {
  const { id } = req.body;
  try {
    const existingUser = await Post.find({ creatorId: id });

    let like = 0;

    existingUser.map((item) => {
      if (item.likes) {
        like = like + item.likes.length;
      }
    });

    res.status(200).json({ like });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    const existingPost = await Post.findById(id);
    if (!existingPost)
      return res.status(400).json({ message: "Post doesn't exists" });
    await Post.findByIdAndDelete(id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

export const sharePost = async (req, res) => {
  try {
    const { text, postId } = req.body;

    const newPost = await Post.create({
      text,
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
