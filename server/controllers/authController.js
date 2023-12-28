const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { createError } = require("../utils/errorHandler");

const saltRounds = 10;

const getJwtSecret = () => {
  return process.env.JWT_SECRET;
};

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, getJwtSecret());
};

const generatePassword = () => {
  return (
    Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
  );
};

const signUp = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Basic input validations
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if the username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      throw createError(400, "Username or Email already exists");
    }

    // Password hashing with bcrypt
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user with hashed password
    const newUser = new User({ username, email, password: hashedPassword });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser || !bcrypt.compareSync(password, existingUser.password)) {
      throw createError(400, "Wrong Email or Password");
    }

    const token = generateToken(existingUser._id);

    const { password: userPassword, ...userDetails } = existingUser._doc;

    res
      .cookie("access_token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // Corrected
      })
      .status(200)
      .json(userDetails);
  } catch (error) {
    next(error);
  }
};

const google = async (req, res, next) => {
  const { email, photo } = req.body;
  try {
    let existingUser = await User.findOne({ email });

    if (!existingUser) {
      const generatedPassword = generatePassword();
      const hashedPassword = bcrypt.hashSync(generatedPassword, saltRounds);
      const username = email.split("@")[0];

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        avatar: photo,
        oAuthUser: true,
      });

      // Save the user to the database
      existingUser = await newUser.save();
    }

    const token = generateToken(existingUser._id);

    const { password: userPassword, ...userDetails } = existingUser._doc;

    res
      .cookie("access_token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      })
      .status(200)
      .json(userDetails);
  } catch (error) {
    next(error);
  }
};

const signOut = async (req, res, next) => {
  try {
    console.log("signout");
    res
      .clearCookie("access_token")
      .status(200)
      .json("User has been logged out");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signUp,
  signIn,
  google,
  signOut,
};
