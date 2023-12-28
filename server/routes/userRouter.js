const express = require("express");
const { updateUser, deleteUser } = require("../controllers/userController");
const { verifyToken } = require("../utils/verifyUser");

const router = express.Router();

router.post("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
module.exports = router;
