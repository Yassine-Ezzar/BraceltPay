const Card = require('../models/card');
const User = require('../models/User');

// Validation des données
const validateCardData = (cardNumber, expiryDate, cvv) => {
  const cardNumberRegex = /^\d{16}$/; // 16 chiffres
  const expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/; // MM/YY
  const cvvRegex = /^\d{3,4}$/; // 3 ou 4 chiffres

  if (!cardNumberRegex.test(cardNumber)) {
    return 'Numéro de carte invalide (16 chiffres requis)';
  }
  if (!expiryDateRegex.test(expiryDate)) {
    return 'Date d’expiration invalide (format MM/YY)';
  }
  if (!cvvRegex.test(cvv)) {
    return 'CVV invalide (3 ou 4 chiffres requis)';
  }
  return null;
};

// Ajouter une carte
exports.addCard = async (req, res) => {
  const { userId, cardNumber, expiryDate, cvv } = req.body;

  const validationError = validateCardData(cardNumber, expiryDate, cvv);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const card = new Card({ userId, cardNumber, expiryDate, cvv });
    await card.save();

    user.cards.push(card._id);
    await user.save();

    res.status(201).json({ message: 'Carte ajoutée avec succès', card });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

// Supprimer une carte
exports.deleteCard = async (req, res) => {
  const { cardId } = req.params;

  try {
    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ message: 'Carte non trouvée' });
    }

    await Card.deleteOne({ _id: cardId });
    await User.updateOne({ _id: card.userId }, { $pull: { cards: cardId } });

    res.json({ message: 'Carte supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

// Récupérer toutes les cartes d’un utilisateur
exports.getCards = async (req, res) => {
  const { userId } = req.query;

  try {
    const cards = await Card.find({ userId });
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};
