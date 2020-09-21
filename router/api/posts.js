const express = require("express");
const { check, validationResult } = require("express-validator");
const Post = require("../../models/Post");
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const router = express.Router();

// @route      Post api/posts
// @desc       Post posts by token
// @access     Private
router.post(
  "/",
  [
    auth,
    [
      check("text", "Text is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(401).json({ errors: errors.array() });

    try {
      const user = await User.findById(req.user.id).select("-password");

      const newPost = new Post({
        user: req.user.id,
        text: req.body.text,
        avatar: user.avatar,
        name: user.name
      });

      const post = await newPost.save();
      res.json(post);
    } catch (err) {
      res.status(400).send(err);
    }
  }
);

// @route      Get api/posts
// @desc       Get post by token
// @access     Private

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(401).json({ meg: "Server error" });
  }
});

// @route      Get api/posts
// @desc       Get user by id
// @access     Private
router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/) || !post) {
      res.status(401).json({ meg: "Post not found" });
    }
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(401).json({ meg: "Server error" });
  }
});

// @route      Delete api/posts
// @desc       delete user by id
// @access     Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/) || !post) {
      res.status(401).json({ msg: "Post not found" });
    }

    if (post.user.toString() != req.user.id) {
      res.status(401).json({ msg: "Not authenticated" });
    }

    await post.remove();
    res.json({ msg: "Post deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(401).json({ msg: "Server error" });
  }
});

// @route      Put api/posts
// @desc       put like by token
// @access     Private
router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      res.status(401).json({ msg: "Post already liked" });
    }

    post.likes.unshift({ user: req.user.id });

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(401).json({ msg: "Server error" });
  }
});

// @route      Put api/posts
// @desc       put unlike by token
// @access     Private
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length ===
      0
    ) {
      res.status(401).json({ msg: "Post has not been like yet" });
    }

    const removeIndex = post.likes
      .map(like => like.user.toString())
      .indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(401).json({ msg: "Server error" });
  }
});

// @route      Post api/posts/comment
// @desc       Post comment by token
// @access     Private
router.post(
  "/comment/:id",
  [
    auth,
    [
      check("text", "Text is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error(errors.array());
      res.status(401).json({ msg: "Comment failed" });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      };

      post.comment.unshift(newComment);

      await post.save();

      res.json(post.comment);
    } catch (err) {
      console.error(err.message);
      res.status(401).json({ msg: "Comment failed" });
    }
  }
);

// @route      Delete api/posts/comment
// @desc       Delete comment by token
// @access     Private
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Pull out comment
    const comment = post.comment.find(
      comment => comment.id === req.params.comment_id
    );

    // Make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: "Comment does not exist" });
    }

    // Check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    // Get remove index
    const removeIndex = post.comment
      .map(comment => comment.id)
      .indexOf(req.params.comment_id);

    post.comment.splice(removeIndex, 1);

    await post.save();

    res.json(post.comment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
