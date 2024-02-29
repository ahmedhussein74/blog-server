require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const UserRoute = require("./routes/UserRoute");
const PostRoute = require("./routes/PostRoute");
const CommentRoute = require("./routes/CommentRoute");

// create express app
const app = express();

// middle wares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("combined"));
app.use(express.static("upload"));
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api/users", UserRoute);
app.use("/api/posts", PostRoute);
app.use("/api/comments", CommentRoute);

// run the application and connect to database
app.listen(process.env.PORT, () => {
  console.log(`Server listining on port: ${process.env.PORT}`);
  mongoose
    .connect(process.env.URL)
    .then((data) => {
      console.log(`connect to database: ${data.connection.name}`);
    })
    .catch((error) => {
      console.log(`Error: ${error}`);
    });
});
