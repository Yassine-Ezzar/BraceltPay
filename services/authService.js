const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const registerUser = async (email, pin, faceIdEnabled) => {
  const userExists = await User.findOne({ email });
  if (userExists) throw new Error("Utilisateur déjà enregistré");

  const user = await User.create({ email, pin, faceIdEnabled });
  return { userId: user._id, token: generateToken(user._id) };
};

const loginUser = async (email, pin, faceIdUsed) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Utilisateur non trouvé");

  if (faceIdUsed && !user.faceIdEnabled) throw new Error("Face ID non activé");

  if (!faceIdUsed && !(await user.matchPin(pin))) throw new Error("Code PIN incorrect");

  return { userId: user._id, token: generateToken(user._id) };
};

module.exports = { registerUser, loginUser };
