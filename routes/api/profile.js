const express = require("express");
const router = express.Router();

// @route   GET (server.js): "/api/profile"
// @desc    Test profile routes
// @access  Public

router.get("/test", (req, res) => {
  res.json({ msg: "profile route works" });
});

module.exports = router;
