const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRouter = require("./routes/userRouter");
const authRouter = require("./routes/authRouter");

dotenv.config();

mongoose
  .connect(process.env.MONGOURI)
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((e) => {
    console.log("Data not connected", e);
  });

const expressApp = express();
expressApp.use(express.json());

expressApp.use("/api/user", userRouter);
expressApp.use("/api/auth", authRouter);

expressApp.listen(3000, () => {
  console.log("Server is running on port 3000!");
});
