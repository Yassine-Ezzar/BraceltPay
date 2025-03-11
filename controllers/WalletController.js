const Card = require('../models/card');
const User = require('../models/User');

// Fonction pour valider les données de la carte
const validateCardData = ({ cardNumber, expiryDate, cvv }) => {
  const cardNumberRegex = /^\d{16}$/; // 16 chiffres
  const expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/; // MM/YY
  const cvvRegex = /^\d{3,4}$/; // 3 ou 4 chiffres

  if (!cardNumberRegex.test(cardNumber)) {
    return 'Le numéro de carte doit contenir exactement 16 chiffres.';
  }
  if (!expiryDateRegex.test(expiryDate)) {
    return 'La date d’expiration doit être au format MM/YY.';
  }
  if (!cvvRegex.test(cvv)) {
    return 'Le CVV doit contenir 3 ou 4 chiffres.';
  }
  return null;
};

exports.addCard = async (req, res) => {
  try {
    const { cardNumber, expiryDate, cvv, cardholderName } = req.body;
    const userId = req.user?.id; // Supposons que l'utilisateur est authentifié via JWT

    // Validation des données
    const validationError = validateCardData({ cardNumber, expiryDate, cvv });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const newCard = new Card({ cardNumber, expiryDate, cvv, cardholderName });
    await newCard.save();

    // Associer la carte à l'utilisateur
    if (userId) {
      await User.findByIdAndUpdate(userId, { $push: { cards: newCard._id } });
    }

    res.status(201).json({ message: 'Carte ajoutée avec succès', card: newCard });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l’ajout de la carte', error });
  }
};

exports.getAllCards = async (req, res) => {
  try {
    const userId = req.user?.id; // Récupérer les cartes de l'utilisateur connecté
    const user = await User.findById(userId).populate('cards');
    res.status(200).json(user.cards || []);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des cartes', error });
  }
};

exports.deleteCard = async (req, res) => {
  try {
    const cardId = req.params.id;
    const userId = req.user?.id;

    await Card.findByIdAndDelete(cardId);
    if (userId) {
      await User.findByIdAndUpdate(userId, { $pull: { cards: cardId } });
    }
    res.status(200).json({ message: 'Carte supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la carte', error });
  }
};

exports.scanCard = async (req, res) => {
  try {
    const { image } = req.body; // Image encodée en base64 ou URL
    const cardInfo = await extractCardInfo(image); // À implémenter côté serveur ou via un service tiers
    const validationError = validateCardData(cardInfo);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }
    res.status(200).json({ message: 'Carte scannée avec succès', cardInfo });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du scan de la carte', error: error.message });
  }
};

// Fonction fictive pour extraire les infos (à remplacer par une vraie implémentation)
const extractCardInfo = async (image) => {
  // Ici, vous pouvez intégrer une API OCR comme Google Vision ou Tesseract
  // Exemple fictif :
  return {
    cardNumber: '1234567812345678',
    expiryDate: '12/26',
    cvv: '123',
    cardholderName: 'John Doe',
  };
};