const express = require("express");
const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");

const router = express.Router();

// CREATE POST
router.post("/", async (req, res) => {
  try {
    const { content, author } = req.body;

    if (!content || !author) {
      return res.status(400).json({
        message: "Content and author are required",
      });
    }

    const user = await User.findById(author);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const post = await Post.create({
      content,
      author,
    });

    res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    res.status(500).json({
      message: "Post creation failed",
      error: error.message,
    });
  }
});

// GET ALL POSTS
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.json({
      message: "Posts fetched successfully",
      posts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch posts",
      error: error.message,
    });
  }
});

// LIKE / UNLIKE POST
router.put("/:id/like", async (req, res) => {
  try {
    const { userId } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);

      await post.save();

      return res.json({
        message: "Post unliked successfully",
        likes: post.likes,
      });
    }

    post.likes.push(userId);

    await post.save();

    res.json({
      message: "Post liked successfully",
      likes: post.likes,
    });
  } catch (error) {
    res.status(500).json({
      message: "Like/unlike failed",
      error: error.message,
    });
  }
});

// DELETE POST
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Post deletion failed",
      error: error.message,
    });
  }
});

// ADD COMMENT
router.post("/:id/comment", async (req, res) => {
  try {
    const { content, author } = req.body;

    if (!content || !author) {
      return res.status(400).json({
        message: "Content and author are required",
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const user = await User.findById(author);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const comment = await Comment.create({
      content,
      author,
      post: req.params.id,
    });

    res.status(201).json({
      message: "Comment added successfully",
      comment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Comment creation failed",
      error: error.message,
    });
  }
});

// GET COMMENTS
router.get("/:id/comments", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const comments = await Comment.find({ post: req.params.id })
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.json({
      message: "Comments fetched successfully",
      comments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch comments",
      error: error.message,
    });
  }
});

// DELETE COMMENT
router.delete("/:postId/comment/:commentId", async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    const comment = await Comment.findOneAndDelete({
      _id: commentId,
      post: postId,
    });

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    res.json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Comment deletion failed",
      error: error.message,
    });
  }
});

module.exports = router;
