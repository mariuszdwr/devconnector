const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// Load Input Validation

const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model

const User = require("../../models/User");

// Route "/api/users"

// @route   GET (server.js): "/api/users/test"
// @desc    Test users routes
// @access  Public

router.get("/test", (req, res) => {
  res.json({ msg: "users route works" });
});
// @route   GET (server.js): "/api/users/register"
// @desc    Register user
// @access  Public

router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check Validation

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email aleready exists";
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", // optional size
        r: "pg", // optional rating
        d: "mm"
      }); // optiona defaul avatar
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar: avatar,
        require,
        password: req.body.password
      });
      // hash user password, return err or salt, hash given password with salt, return hashed password and save
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user)) // return saved new user
            .catch(err => console.log(err));
        });
      });
    }
  });
});
// @route   GET (server.js): "/api/users/login"
// @desc    Login user / Return JWT Token
// @access  Public

router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  // Check Validation

  if (!isValid) {
    console.log(errors);
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  //Find user by email

  User.findOne({ email }).then(user => {
    // check for user
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }
    // Check Password -> compare plain text with hash
    bcrypt
      .compare(password, user.password) // returns true or false value
      .then(isMatch => {
        if (isMatch) {
          // User Matched
          // Sign Token
          // Create JWT Payload (whatever data you need to seend)
          const payload = {
            id: user.id,
            name: user.name,
            avatar: user.avatar
          };
          jwt.sign(
            payload,
            keys.secretOrKey,
            { expiresIn: 3600 },
            (err, token) => {
              res.json({
                succes: true,
                token: "Bearer " + token
              });
            }
          );
        } else {
          errors.password = "Password incorrect";
          return res.status(400).json(errors);
        }
      });
  });
});

// @route   GET (server.js): "/api/users/current"
// @desc    Return current user
// @access  Private

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

module.exports = router;
