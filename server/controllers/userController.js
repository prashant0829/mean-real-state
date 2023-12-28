const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { createError } = require("../utils/errorHandler");
const bcrypt = require("bcryptjs");

const saltRounds = 10;

const getJwtSecret = () => {
  return process.env.JWT_SECRET;
};

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, getJwtSecret());
};

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

    const token = generateToken(updatedUser._id);

    const { password: userPassword, ...rest } = updatedUser._doc;

    res
      .cookie("access_token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  const { id } = req.params;
  const { password, username, email, avatar } = req.body;

  try {
    if (req.user.id !== id) {
      throw createError(401, "Unauthorized to delete the account");
    }
    await User.findByIdAndDelete(req.params.id);
    res
      .clearCookie("access_token")
      .status(200)
      .json("User has been deleted successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = { updateUser, deleteUser };
