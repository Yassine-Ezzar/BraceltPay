const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  pin: { type: String, required: false }, // Stocké en hash
  faceIdEnabled: { type: Boolean, default: false }, // Face ID / Touch ID activé ?
});

// Hash du PIN avant sauvegarde
UserSchema.pre("save", async function (next) {
  if (!this.isModified("pin")) return next();
  const salt = await bcrypt.genSalt(10);
  this.pin = await bcrypt.hash(this.pin, salt);
  next();
});

// Vérification du PIN
UserSchema.methods.matchPin = async function (enteredPin) {
  return await bcrypt.compare(enteredPin, this.pin);
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
