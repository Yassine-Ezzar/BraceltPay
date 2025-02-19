const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  pin: { type: String, required: false }, // PIN sécurisé avec bcrypt
  faceIdEnabled: { type: Boolean, default: false }, // Activer Face ID / Touch ID
  touchIdEnabled: { type: Boolean, default: false }, // Activer Touch ID
  securityQuestion: { type: String, required: false }, // Question de sécurité
  securityAnswer: { type: String, required: false }, // Réponse hachée
});

module.exports = mongoose.model("User", userSchema);
