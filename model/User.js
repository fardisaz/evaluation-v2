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
    required: false,
  },
  notNovelAnswers: {
    type: Array,
    required: false,
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
  newIdeas: [IdeaSchema],
});

UserSchema.pre("save", function (next) {
  //put "if" statement here in case needed
  this.ideas = [];
  this.newIdeas = [];
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
    extractedTopic: "",
  });
  this.ideas.push({
    title: "Idea 6",
    position: {
      left: 90,
      top: 500,
    },
    description: "",
    classification: "",
    novelAnswers: ["", ""],
    notNovelAnswers: ["", "", ""],
    extractedTopic: "",
  });
  this.ideas.push({
    title: "Idea 7",
    position: {
      left: 400,
      top: 400,
    },
    description: "",
    classification: "",
    novelAnswers: ["", ""],
    notNovelAnswers: ["", "", ""],
    extractedTopic: "",
  });
  this.ideas.push({
    title: "Idea 8",
    position: {
      left: 1000,
      top: 350,
    },
    description: "",
    classification: "",
    novelAnswers: ["", ""],
    notNovelAnswers: ["", "", ""],
    extractedTopic: "",
  });
  this.ideas.push({
    title: "Idea 9",
    position: {
      left: 900,
      top: 245,
    },
    description: "",
    classification: "",
    novelAnswers: ["", ""],
    notNovelAnswers: ["", "", ""],
    extractedTopic: "",
  });
  this.ideas.push({
    title: "Idea 10",
    position: {
      left: 590,
      top: 600,
    },
    description: "",
    classification: "",
    novelAnswers: ["", ""],
    notNovelAnswers: ["", "", ""],
    extractedTopic: "",
  });
  this.ideas.push({
    title: "Idea 11",
    position: {
      left: 1190,
      top: 350,
    },
    description: "",
    classification: "",
    novelAnswers: ["", ""],
    notNovelAnswers: ["", "", ""],
    extractedTopic: "",
  });
  this.ideas.push({
    title: "Idea 12",
    position: {
      left: 1170,
      top: 200,
    },
    description: "",
    classification: "",
    novelAnswers: ["", ""],
    notNovelAnswers: ["", "", ""],
    extractedTopic: "",
  });
  this.ideas.push({
    title: "Idea 13",
    position: {
      left: 765,
      top: 85,
    },
    description: "",
    classification: "",
    novelAnswers: ["", ""],
    notNovelAnswers: ["", "", ""],
    extractedTopic: "",
  });
  this.ideas.push({
    title: "Idea 14",
    position: {
      left: 600,
      top: 150,
    },
    description: "",
    classification: "",
    novelAnswers: ["", ""],
    notNovelAnswers: ["", "", ""],
    extractedTopic: "",
  });
  this.ideas.push({
    title: "Idea 15",
    position: {
      left: 650,
      top: 600,
    },
    description: "",
    classification: "",
    novelAnswers: ["", ""],
    notNovelAnswers: ["", "", ""],
    extractedTopic: "",
  });
  // New ideas
  this.newIdeas.push({
    title: "Idea 1",
    position: {
      left: 0,
      top: 0,
    },
    description: "",
    classification: "",
    extractedTopic: "",
  });
  this.newIdeas.push({
    title: "Idea 2",
    position: {
      left: 0,
      top: 0,
    },
    description: "",
    classification: "",
    extractedTopic: "",
  });
  this.newIdeas.push({
    title: "Idea 3",
    position: {
      left: 0,
      top: 0,
    },
    description: "",
    classification: "",
    extractedTopic: "",
  });
  this.newIdeas.push({
    title: "Idea 4",
    position: {
      left: 0,
      top: 0,
    },
    description: "",
    classification: "",
    extractedTopic: "",
  });
  this.newIdeas.push({
    title: "Idea 5",
    position: {
      left: 0,
      top: 0,
    },
    description: "",
    classification: "",
    extractedTopic: "",
  });
  this.newIdeas.push({
    title: "Idea 6",
    position: {
      left: 0,
      top: 0,
    },
    description: "",
    classification: "",
    extractedTopic: "",
  });
  this.newIdeas.push({
    title: "Idea 7",
    position: {
      left: 0,
      top: 0,
    },
    description: "",
    classification: "",
    extractedTopic: "",
  });
  this.newIdeas.push({
    title: "Idea 8",
    position: {
      left: 0,
      top: 0,
    },
    description: "",
    classification: "",
    extractedTopic: "",
  });
  this.newIdeas.push({
    title: "Idea 9",
    position: {
      left: 0,
      top: 0,
    },
    description: "",
    classification: "",
    extractedTopic: "",
  });
  this.newIdeas.push({
    title: "Idea 10",
    position: {
      left: 0,
      top: 0,
    },
    description: "",
    classification: "",
    extractedTopic: "",
  });
  this.newIdeas.push({
    title: "Idea 11",
    position: {
      left: 0,
      top: 0,
    },
    description: "",
    classification: "",
    extractedTopic: "",
  });
  this.newIdeas.push({
    title: "Idea 12",
    position: {
      left: 0,
      top: 0,
    },
    description: "",
    classification: "",
    extractedTopic: "",
  });
  this.newIdeas.push({
    title: "Idea 13",
    position: {
      left: 0,
      top: 0,
    },
    description: "",
    classification: "",
    extractedTopic: "",
  });
  this.newIdeas.push({
    title: "Idea 14",
    position: {
      left: 0,
      top: 0,
    },
    description: "",
    classification: "",
    extractedTopic: "",
  });
  this.newIdeas.push({
    title: "Idea 15",
    position: {
      left: 0,
      top: 0,
    },
    description: "",
    classification: "",
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
