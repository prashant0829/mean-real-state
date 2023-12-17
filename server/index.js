import express from "express";

const expressApp = express();

expressApp.listen(3000, () => {
  console.log("Server is running on port 3000!");
});
