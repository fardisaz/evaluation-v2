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
 * @route GET api/users/profile
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
 * @route PATCH api/users/import
 * @desc Return the User's ideas
 * @access Private
 */
router.patch(
  "/import",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
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
      //res.send(ideas);
      res.send(req.user.ideas);
    } catch (e) {
      res.status(500).send();
    }
  }
);
/**
 * @route PATCH api/users/ideas/:id
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
        (error, result) => {
          if (error) {
            res.status(500).send();
          }
          // res.send(result);
          console.log(result);
        }
      );
      res.send(req.user.ideas);
    } catch (e) {
      res.status(500).send();
    }
  }
);

/**
 * @route GET api/users/countUsers
 * @desc Return the number of users
 * @access Public
 */
router.get("/countUsers", async (req, res) => {
  const arr = [];
  let res1;
  let res2;
  res1 = await User.count({
    ideas: { $elemMatch: { title: "Idea 1", classification: "Novel" } },
  });

  res2 = await User.count({
    ideas: { $elemMatch: { title: "Idea 1", classification: "Not Novel" } },
  });
  arr.push({ title: "Idea 1", Novel: res1, "Not Novel": res2 });
  res1 = await User.count({
    ideas: { $elemMatch: { title: "Idea 2", classification: "Novel" } },
  });

  res2 = await User.count({
    ideas: { $elemMatch: { title: "Idea 2", classification: "Not Novel" } },
  });
  arr.push({ title: "Idea 2", Novel: res1, "Not Novel": res2 });
  res1 = await User.count({
    ideas: { $elemMatch: { title: "Idea 3", classification: "Novel" } },
  });

  res2 = await User.count({
    ideas: { $elemMatch: { title: "Idea 3", classification: "Not Novel" } },
  });
  arr.push({ title: "Idea 3", Novel: res1, "Not Novel": res2 });
  res1 = await User.count({
    ideas: { $elemMatch: { title: "Idea 4", classification: "Novel" } },
  });

  res2 = await User.count({
    ideas: { $elemMatch: { title: "Idea 4", classification: "Not Novel" } },
  });
  arr.push({ title: "Idea 4", Novel: res1, "Not Novel": res2 });
  res1 = await User.count({
    ideas: { $elemMatch: { title: "Idea 5", classification: "Novel" } },
  });

  res2 = await User.count({
    ideas: { $elemMatch: { title: "Idea 5", classification: "Not Novel" } },
  });
  arr.push({ title: "Idea 5", Novel: res1, "Not Novel": res2 });

  res.json(arr);
});

module.exports = router;
