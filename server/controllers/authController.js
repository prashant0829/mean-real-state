const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

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
      const error = new Error("User or email already exists");
      error.status = 400;
      throw error;
    }

    // Password hashing with bcrypt
    const saltRounds = 10;
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

module.exports = {
  signUp,
};
