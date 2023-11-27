const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Post = require("../models/post");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

//endpoint to create a post
app.post("/api/create", async (req, res) => {
  try {
    const { description, imageUrl, userId } = req.body;

    const newPost = new Post({
      description: description,
      imageUrl: imageUrl,
      user: userId,
    });

    await newPost.save();

    res
      .status(201)
      .json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    console.log("error creating the post", error);
    res.status(500).json({ message: "Error creating the post" });
  }
});

//endpoint to fetch all the posts
app.get("/api/all", async (req, res) => {
  try {
    const posts = await Post.find().populate("user", "name profileImage");

    res.status(200).json({ posts });
  } catch (error) {
    console.log("error fetching all the posts", error);
    res.status(500).json({ message: "Error fetching all the posts" });
  }
});

module.exports = router;
