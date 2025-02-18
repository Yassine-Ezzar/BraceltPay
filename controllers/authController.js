const asyncHandler = require("express-async-handler");
const { registerUser, loginUser } = require("../services/authService");

// Inscription
const register = asyncHandler(async (req, res) => {
  const { email, pin, faceIdEnabled } = req.body;
  try {
    const result = await registerUser(email, pin, faceIdEnabled);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Connexion
const login = asyncHandler(async (req, res) => {
  const { email, pin, faceIdUsed } = req.body;
  try {
    const result = await loginUser(email, pin, faceIdUsed);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = { register, login };
