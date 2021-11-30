const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const key = require("../../config/keys").secret;
const User = require("../../model/User");
const axios = require("axios");
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
          newIdeas: user.newIdeas,
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
            "ideas.$.novelAnswers": req.body.novelAnswers,
            "ideas.$.notNovelAnswers": req.body.notNovelAnswers,
            "ideas.$.similarIdeas": req.body.similarIdeas,
            "ideas.$.position": req.body.position,
            "ideas.$.classification": req.body.classification,
            "ideas.$.extractedTopic": req.body.extractedTopic,
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
 * @route GET api/users/countNovelty
 * @desc Return the ideas with the information like how many users rate them as novel/not novel and all their answers to the questions
 * @access Public
 */
router.get("/countNovelty", async (req, res) => {
  const arr = [];
  let res1;
  let res2;
  const ideas = await User.ideasToArray();
  const novelArr = (inputTitle, ideas) => {
    let newArr = [];
    ideas.forEach((idea) => {
      if (idea.title === inputTitle) {
        if (!idea.novelAnswers[0] && !idea.novelAnswers[1]) {
          newArr;
        } else {
          newArr.push(idea.novelAnswers);
        }
      }
    });
    let merged = [].concat.apply([], newArr);
    return merged;
  };
  const antiNovelArr = (inputTitle, ideas) => {
    let newArr = [];
    ideas.forEach((idea) => {
      if (idea.title === inputTitle) {
        if (
          !idea.notNovelAnswers[0] &&
          !idea.notNovelAnswers[1] &&
          !idea.notNovelAnswers[2]
        ) {
          newArr;
        } else {
          newArr.push(idea.notNovelAnswers);
        }
      }
    });
    let merged = [].concat.apply([], newArr);
    return merged;
  };
  res1 = await User.count({
    ideas: { $elemMatch: { title: "Idea 1", classification: "Novel" } },
  });

  res2 = await User.count({
    ideas: { $elemMatch: { title: "Idea 1", classification: "Not Novel" } },
  });

  arr.push({
    title: "Idea 1",
    Novel: res1,
    NotNovel: res2,
    NovelAnswers: novelArr("Idea 1", ideas),
    NotNovelAnswers: antiNovelArr("Idea 1", ideas),
  });
  res1 = await User.count({
    ideas: { $elemMatch: { title: "Idea 2", classification: "Novel" } },
  });

  res2 = await User.count({
    ideas: { $elemMatch: { title: "Idea 2", classification: "Not Novel" } },
  });
  arr.push({
    title: "Idea 2",
    Novel: res1,
    NotNovel: res2,
    NovelAnswers: novelArr("Idea 2", ideas),
    NotNovelAnswers: antiNovelArr("Idea 2", ideas),
  });
  res1 = await User.count({
    ideas: { $elemMatch: { title: "Idea 3", classification: "Novel" } },
  });

  res2 = await User.count({
    ideas: { $elemMatch: { title: "Idea 3", classification: "Not Novel" } },
  });
  arr.push({
    title: "Idea 3",
    Novel: res1,
    NotNovel: res2,
    NovelAnswers: novelArr("Idea 3", ideas),
    NotNovelAnswers: antiNovelArr("Idea 3", ideas),
  });
  res1 = await User.count({
    ideas: { $elemMatch: { title: "Idea 4", classification: "Novel" } },
  });

  res2 = await User.count({
    ideas: { $elemMatch: { title: "Idea 4", classification: "Not Novel" } },
  });
  arr.push({
    title: "Idea 4",
    Novel: res1,
    NotNovel: res2,
    NovelAnswers: novelArr("Idea 4", ideas),
    NotNovelAnswers: antiNovelArr("Idea 4", ideas),
  });
  res1 = await User.count({
    ideas: { $elemMatch: { title: "Idea 5", classification: "Novel" } },
  });

  res2 = await User.count({
    ideas: { $elemMatch: { title: "Idea 5", classification: "Not Novel" } },
  });
  arr.push({
    title: "Idea 5",
    Novel: res1,
    NotNovel: res2,
    NovelAnswers: novelArr("Idea 5", ideas),
    NotNovelAnswers: antiNovelArr("Idea 5", ideas),
  });
  res1 = await User.count({
    ideas: { $elemMatch: { title: "Idea 6", classification: "Novel" } },
  });

  res2 = await User.count({
    ideas: { $elemMatch: { title: "Idea 6", classification: "Not Novel" } },
  });

  arr.push({
    title: "Idea 6",
    Novel: res1,
    NotNovel: res2,
    NovelAnswers: novelArr("Idea 6", ideas),
    NotNovelAnswers: antiNovelArr("Idea 6", ideas),
  });
  res1 = await User.count({
    ideas: { $elemMatch: { title: "Idea 7", classification: "Novel" } },
  });

  res2 = await User.count({
    ideas: { $elemMatch: { title: "Idea 7", classification: "Not Novel" } },
  });

  arr.push({
    title: "Idea 7",
    Novel: res1,
    NotNovel: res2,
    NovelAnswers: novelArr("Idea 7", ideas),
    NotNovelAnswers: antiNovelArr("Idea 7", ideas),
  });
  res1 = await User.count({
    ideas: { $elemMatch: { title: "Idea 8", classification: "Novel" } },
  });

  res2 = await User.count({
    ideas: { $elemMatch: { title: "Idea 8", classification: "Not Novel" } },
  });

  arr.push({
    title: "Idea 8",
    Novel: res1,
    NotNovel: res2,
    NovelAnswers: novelArr("Idea 8", ideas),
    NotNovelAnswers: antiNovelArr("Idea 8", ideas),
  });
  res1 = await User.count({
    ideas: { $elemMatch: { title: "Idea 9", classification: "Novel" } },
  });

  res2 = await User.count({
    ideas: { $elemMatch: { title: "Idea 9", classification: "Not Novel" } },
  });

  arr.push({
    title: "Idea 9",
    Novel: res1,
    NotNovel: res2,
    NovelAnswers: novelArr("Idea 9", ideas),
    NotNovelAnswers: antiNovelArr("Idea 9", ideas),
  });
  res1 = await User.count({
    ideas: { $elemMatch: { title: "Idea 10", classification: "Novel" } },
  });

  res2 = await User.count({
    ideas: { $elemMatch: { title: "Idea 10", classification: "Not Novel" } },
  });

  arr.push({
    title: "Idea 10",
    Novel: res1,
    NotNovel: res2,
    NovelAnswers: novelArr("Idea 10", ideas),
    NotNovelAnswers: antiNovelArr("Idea 10", ideas),
  });
  const total = await User.count({});

  res.json({ total, arr });
});

/**
 * @route POST api/users/similarity
 * @desc Return the similarity of ideas
 * @access Private
 */
router.post(
  "/similarity",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      let text1 = req.body.text1;
      let text2 = req.body.text2;
      const url = `https://api.dandelion.eu/datatxt/sim/v1/?text1=${text1}&text2=${text2}&token=943cd78b08354bd2b7d49669fc3d6ba3&lang=en`;
      let response = await axios.get(url);
      console.log("this is the dandelion res:", response.data);
      res.send(response.data);
    } catch (error) {
      throw error;
    }
  }
);

/**
 * @route PATCH api/users/importNewIdeas
 * @desc Return the User's new ideas
 * @access Private
 */
router.patch(
  "/importNewIdeas",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const descs = req.body.descriptions;
    const newIdeas = req.user.newIdeas;

    try {
      newIdeas.forEach((idea, index) => {
        User.update(
          { "newIdeas._id": idea._id },
          {
            $set: {
              "newIdeas.$.description": req.body.descriptions[index],
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
      res.send(req.user.newIdeas);
    } catch (e) {
      res.status(500).send();
    }
  }
);

/**
 * @route PATCH api/users/newIdeas/:id
 * @desc Return the updates User's new ideas
 * @access Private
 */
router.patch(
  "/newIdeas/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      User.update(
        { "newIdeas._id": req.params.id },
        {
          $set: {
            "newIdeas.$.position": req.body.position,
            "newIdeas.$.classification": req.body.classification,
            "newIdeas.$.extractedTopic": req.body.extractedTopic,
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
      res.send(req.user.newIdeas);
    } catch (e) {
      res.status(500).send();
    }
  }
);
module.exports = router;
