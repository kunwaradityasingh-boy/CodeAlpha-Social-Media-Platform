const express = require("express");
const User = require("../models/User");
const Follower = require("../models/Follower");
const Post = require("../models/Post");

const router = express.Router();

// FOLLOW / UNFOLLOW USER
router.put("/:id/follow", async (req, res) => {
  try {
    const { followerId } = req.body;
    const followingId = req.params.id;

    if (!followerId) {
      return res.status(400).json({
        message: "Follower ID is required",
      });
    }

    if (followerId === followingId) {
      return res.status(400).json({
        message: "You cannot follow yourself",
      });
    }

    const followerUser = await User.findById(followerId);
    const followingUser = await User.findById(followingId);

    if (!followerUser || !followingUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const existingFollow = await Follower.findOne({
      follower: followerId,
      following: followingId,
    });

    if (existingFollow) {
      await Follower.findByIdAndDelete(existingFollow._id);

      return res.json({
        message: "User unfollowed successfully",
      });
    }

    await Follower.create({
      follower: followerId,
      following: followingId,
    });

    res.json({
      message: "User followed successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Follow/unfollow failed",
      error: error.message,
    });
  }
});

// GET USER PROFILE WITH COUNTS
router.get("/:id/profile", async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select("name email");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const postCount = await Post.countDocuments({
      author: userId,
    });

    const followerCount = await Follower.countDocuments({
      following: userId,
    });

    const followingCount = await Follower.countDocuments({
      follower: userId,
    });

    res.json({
      message: "Profile fetched successfully",
      profile: {
        _id: user._id,
        name: user.name,
        email: user.email,
        postCount,
        followerCount,
        followingCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
});

module.exports = router;
