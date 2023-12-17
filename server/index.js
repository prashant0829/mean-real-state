import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

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

expressApp.listen(3000, () => {
  console.log("Server is running on port 3000!");
});
