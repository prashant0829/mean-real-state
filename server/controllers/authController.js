const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

const signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Basic input validations
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
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
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  signUp,
};
