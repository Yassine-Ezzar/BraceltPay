const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  pin: { type: String, required: true },
  securityQuestion: { type: String, default: "Quel est le nom de votre animal ?" },
  securityAnswer: { type: String, required: true },
  biometricEnabled: { type: Boolean, default: false },
  cards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Card' }], 
  createdAt: { type: Date, default: Date.now },
});

userSchema.pre('save', async function(next) {
  if (this.isModified('pin')) {
    this.pin = await bcrypt.hash(this.pin, 10);
  }
  if (this.isModified('securityAnswer')) {
    this.securityAnswer = await bcrypt.hash(this.securityAnswer, 10);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);