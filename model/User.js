const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Idea Schema
const IdeaSchema = new Schema({
  id: {
    type: String,
  },
  title: {
    type: String,
  },
  position: {
    type: Object,
  },
  description: {
    type: String,
  },
  classification: {
    type: String,
  },
  novelAnswers: {
    type: Array,
  },
  notNovelAnswers: {
    type: Array,
  },
  similarIdeas: {
    type: Array,
  },
  extractedTopic: {
    type: String,
  },
});
//Create the User Schema
const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  ideas: [IdeaSchema],
});

UserSchema.pre("save", function (next) {
  //put "if" statement here in case needed
  this.ideas = [];
  this.ideas.push({
    title: "Idea 1",
    position: {
      left: 183,
      top: 686,
    },
    description: "",
    classification: "",
    novelAnswers: ["", ""],
    notNovelAnswers: ["", "", ""],
    similarIdeas: [],
    extractedTopic: "",
  });
  this.ideas.push({
    title: "Idea 2",
    position: {
      left: 278,
      top: 469,
    },
    description: "",
    classification: "",
    novelAnswers: ["", ""],
    notNovelAnswers: ["", "", ""],
    similarIdeas: [],
    extractedTopic: "",
  });
  this.ideas.push({
    title: "Idea 3",
    position: {
      left: 820,
      top: 414,
    },
    description: "",
    classification: "",
    novelAnswers: ["", ""],
    notNovelAnswers: ["", "", ""],
    similarIdeas: [],
    extractedTopic: "",
  });
  this.ideas.push({
    title: "Idea 4",
    position: {
      left: 630,
      top: 252,
    },
    description: "",
    classification: "",
    novelAnswers: ["", ""],
    notNovelAnswers: ["", "", ""],
    similarIdeas: [],
    extractedTopic: "",
  });
  this.ideas.push({
    title: "Idea 5",
    position: {
      left: 399,
      top: 643,
    },
    description: "",
    classification: "",
    novelAnswers: ["", ""],
    notNovelAnswers: ["", "", ""],
    similarIdeas: [],
    extractedTopic: "",
  });
  next();
});

UserSchema.statics.ideasToArray = function () {
  let users = this.find({});
  let ideas = users.distinct("ideas");
  return ideas;
};

module.exports = User = mongoose.model("users", UserSchema);
