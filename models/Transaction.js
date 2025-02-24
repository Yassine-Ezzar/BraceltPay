const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  cardId: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  merchant: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Payment', paymentSchema);