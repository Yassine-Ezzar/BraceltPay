const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cardNumber: { type: String, required: true },
  expiryDate: { type: String, required: true }, // Format: MM/YY
  cvv: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Card', cardSchema);