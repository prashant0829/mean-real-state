const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { errorHandler, createError } = require("../utils/errorHandler");
const bcrypt = require("bcryptjs");

const saltRounds = 10;

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { password, username, email, avatar } = req.body;

    if (req.user.id !== id) {
      throw createError(401, "Unauthorized");
    }

    const updatedFields = {};

    if (password) {
      updatedFields.password = bcrypt.hashSync(password, saltRounds);
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: { username, email, password: updatedFields.password, avatar } },
      { new: true }
    );

    const { password: userPassword, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

module.exports = { updateUser };
