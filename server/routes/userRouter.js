const express = require("express");
const { updateUser } = require("../controllers/userController");
const { verifyToken } = require("../utils/verifyUser");

const router = express.Router();

router.post("/update/:id", verifyToken, updateUser);
module.exports = router;
