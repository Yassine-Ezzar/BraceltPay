const stripe = require('../config/stripe');
const Payment = require('../models/Payment');

exports.processPayment = async (userId, cardId, amount, currency, merchant) => {
  try {
    // Créer un paiement avec Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convertir en centimes
      currency,
      payment_method: cardId,
      confirm: true,
    });

    // Enregistrer la transaction dans la base de données
    const payment = new Payment({ userId, cardId, amount, currency, merchant });
    await payment.save();

    return { success: true, payment };
  } catch (error) {
    console.error('Payment processing failed:', error);
    throw new Error('Payment processing failed');
  }
};