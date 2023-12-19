// imports
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRouter = require("./routes/userRouter");
const authRouter = require("./routes/authRouter");
const { errorHandler } = require("./errorHandler");

// configurations
dotenv.config();

// database connection
mongoose
  .connect(process.env.MONGOURI)
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((e) => {
    console.log("Data not connected", e);
  });

// initialising the express app
const expressApp = express();

// listening at port 3000
expressApp.listen(3000, () => {
  console.log("Server is running on port 3000!");
});

// middlewares
expressApp.use(express.json());

// routes
expressApp.use("/api/user", userRouter);
expressApp.use("/api/auth", authRouter);
expressApp.use(errorHandler);
