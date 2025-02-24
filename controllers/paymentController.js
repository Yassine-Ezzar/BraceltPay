const Payment = require('../models/Transaction');

exports.createPayment = async (req, res) => {
  try {
    const { userId, cardId, amount, currency, merchant } = req.body;
    const payment = new Payment({ userId, cardId, amount, currency, merchant });
    await payment.save();
    res.status(201).json({ message: 'Payment successful', payment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPaymentHistory = async (req, res) => {
  try {
    const { userId } = req.query;
    const payments = await Payment.find({ userId }).sort({ timestamp: -1 });
    res.status(200).json({ payments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};