const express = require("express");
const router = express.Router();

// @route   GET (server.js): "/api/posts"
// @desc    Test post routes
// @access  Public
router.get("/test", (req, res) => {
  res.json({ msg: "posts route works" });
});

module.exports = router;
