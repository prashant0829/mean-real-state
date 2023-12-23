const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { errorHandler } = require("../errorHandler");

const saltRounds = 10;

const getJwtSecret = () => {
  return process.env.JWT_SECRET;
};
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, getJwtSecret());
};

const handleExistingUser = (message) => {
  const error = new Error(message);
  error.status = 400;
  throw error;
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
      handleExistingUser("Username or Email already exists");
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
      handleExistingUser("Wrong Email or Password");
    }

    const token = generateToken(existingUser._id);

    const { password: userPassword, ...userDetails } = existingUser._doc;

    res
      .cookie("access_token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60),
      })
      .status(200)
      .json(userDetails);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signUp,
  signIn,
};
