const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const passport = require("passport");

//Initialize the app
const app = express();

//Middlewares
//Form Data middleware
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
//Json boddy middleware
app.use(bodyParser.json());

//Cors middleware
app.use(cors());

//Setting up the static directory
app.use(express.static(path.join(__dirname, "public")));

//Use the passport Middleware
app.use(passport.initialize());
//Bring in the passport strategy
require("./config/passport")(passport);

//Bring in the Database Config & connect with the database
const db = require("./config/keys").mongoURI;
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => {
    console.log(`Database connected successfully ${db}`);
  })
  .catch((err) => console.log(`Unable to connect with the database ${err}`));

// app.get("/", (req, res) => {
//   return res.send("<h1>Hello World</h1>");
// });

//Bring in the Users route
const users = require("./routes/api/users");
app.use("/api/users", users);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
