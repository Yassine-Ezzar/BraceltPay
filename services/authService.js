const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const register = async (pin, faceId, touchId) => {
  const user = new User({
    pin,
    faceIdEnabled: faceId,
    touchIdEnabled: touchId,
  });

  await user.save();
  return { user, token: generateToken(user._id) };
};

const login = async (pin, faceId, touchId) => {
  const user = await User.findOne();
  if (!user) throw new Error("Utilisateur non trouvé");

  // Connexion avec Code PIN
  if (pin && !(await user.comparePin(pin))) {
    throw new Error("Code PIN incorrect");
  }

  // Connexion avec Face ID
  if (faceId && !user.faceIdEnabled) {
    throw new Error("Face ID non activé pour cet utilisateur");
  }

  // Connexion avec Touch ID
  if (touchId && !user.touchIdEnabled) {
    throw new Error("Touch ID non activé pour cet utilisateur");
  }

  return { user, token: generateToken(user._id) };
};

// Suppression du compte utilisateur
const deleteUser = async (userId) => {
  await User.findByIdAndDelete(userId);
};

// Récupérer tous les utilisateurs
const getAllUsers = async () => {
  return await User.find();
};


module.exports = { register, login,deleteUser,getAllUsers };
