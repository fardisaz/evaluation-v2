const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const key = require("../../config/keys").secret;
const User = require("../../model/User");

/**
 * @route POST api/users/register
 * @desc Register the User
 * @access Public
 */
router.post("/register", (req, res) => {
  let { username, password } = req.body;
  //Check for the unique Username
  User.findOne({
    username: username,
  }).then((user) => {
    if (user) {
      return res.status(400).json({
        msg: "Username is already taken.",
      });
    }
  });
  //The data is valid & now we can register the user
  let newUser = new User({
    username,
    password,
  });
  //Hash the password
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      newUser.save().then((user) => {
        return res.status(201).json({
          success: true,
          msg: "User is now registered.",
        });
      });
    });
  });
});

/**
 * @route POST api/users/login
 * @desc Signing in the User
 * @access Public
 */
router.post("/login", (req, res) => {
  User.findOne({ username: req.body.username }).then((user) => {
    if (!user) {
      return res.status(404).json({
        msg: "Username is not found.",
        success: false,
      });
    }
    //If there is user , we should compare the password
    bcrypt.compare(req.body.password, user.password).then((isMatch) => {
      if (isMatch) {
        //User's password is correct & we need to send the JSON Token for that user
        const payload = {
          _id: user._id,
          username: user.username,
          ideas: user.ideas,
        };
        //assign a token for the user
        jwt.sign(payload, key, { expiresIn: 604800 }, (err, token) => {
          res.status(200).json({
            success: true,
            user,
            token: `Bearer ${token}`,
            msg: "You are now logged in!",
          });
        });
      } else {
        return res.status(404).json({
          msg: "Incorrect password.",
          success: false,
        });
      }
    });
  });
});

/**
 * @route POST api/users/profile
 * @desc Return the User's data
 * @access Private
 */
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    return res.json({ user: req.user });
  }
);

/**
 * @route POST api/users/import
 * @desc Return the User's ideas
 * @access Private
 */
router.patch(
  "/import",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const descs = req.body.descriptions;
    const ideas = req.user.ideas;
    try {
      ideas.forEach((idea, index) => {
        User.update(
          { "ideas._id": idea._id },
          {
            $set: {
              "ideas.$.description": req.body.descriptions[index],
            },
          },
          (error, result) => {
            if (error) {
              res.status(500).send();
            }
            // res.send(result);
            console.log(result);
          }
        );
      });
      res.send(ideas);
    } catch (e) {
      res.status(500).send();
    }
  }
);
/**
 * @route POST api/users/ideas/:id
 * @desc Return the updates User's ideas
 * @access Private
 */
router.patch(
  "/ideas/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      User.update(
        { "ideas._id": req.params.id },
        {
          $set: {
            "ideas.$.answers": req.body.answers,
            "ideas.$.similarIdeas": req.body.similarIdeas,
            "ideas.$.position": req.body.position,
            "ideas.$.classification": req.body.classification,
          },
        },
        function (err) {
          console.log("This is the error for updating the value");
        }
      );
      res.send(req.user);
    } catch (e) {
      res.status(500).send();
    }
  }
);

module.exports = router;
