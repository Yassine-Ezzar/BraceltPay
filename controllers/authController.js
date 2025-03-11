const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/config');

exports.register = async (req, res) => {
  const { name, pin, securityAnswer, biometricEnabled } = req.body;

  if (!name || !pin || !securityAnswer || pin.length !== 4 || !/^\d+$/.test(pin)) {
    return res.status(400).json({ message: 'Nom, PIN (4 chiffres), et réponse requis' });
  }

  try {
    const existingUser = await User.findOne({ name });
    if (existingUser) {
      return res.status(400).json({ message: 'Utilisateur déjà existant' });
    }

    const user = new User({ name, pin, securityAnswer, biometricEnabled });
    await user.save();

    const token = jwt.sign({ id: user._id }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
    res.status(201).json({ token, message: 'Utilisateur enregistré' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

exports.login = async (req, res) => {
  const { name, pin } = req.body;

  try {
    const user = await User.findOne({ name });
    if (!user || !(await bcrypt.compare(pin, user.pin))) {
      return res.status(401).json({ message: 'Nom ou PIN incorrect' });
    }

    const token = jwt.sign({ id: user._id }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
    res.json({ token, biometricEnabled: user.biometricEnabled });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

exports.resetPin = async (req, res) => {
  const { name, securityAnswer, newPin } = req.body;

  if (!name || !securityAnswer || !newPin || newPin.length !== 4 || !/^\d+$/.test(newPin)) {
    return res.status(400).json({ message: 'Nom, réponse, et nouveau PIN (4 chiffres) requis' });
  }

  try {
    const user = await User.findOne({ name });
    if (!user || !(await bcrypt.compare(securityAnswer, user.securityAnswer))) {
      return res.status(401).json({ message: 'Nom ou réponse incorrecte' });
    }

    user.pin = newPin;
    await user.save();
    res.json({ message: 'PIN réinitialisé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};