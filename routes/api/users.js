const express = require("express");
const router = express.Router();

// @route   GET (server.js): "/api/posts"
// @desc    Test users routes
// @access  Public

router.get("/test", (req, res) => {
  res.json({ msg: "users route works" });
});

module.exports = router;
