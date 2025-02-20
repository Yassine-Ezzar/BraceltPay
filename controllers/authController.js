const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.register = async (req, res) => {
  try {
      const { pinCode, securityQuestion, securityAnswer, faceIdEnabled, touchIdEnabled } = req.body;
      
      const newUser = await User.create({
          pinCode,
          securityQuestion,
          securityAnswer,
          faceIdEnabled,
          touchIdEnabled
      });

      res.status(201).json({ message: 'Utilisateur inscrit avec succès', user: newUser });
  } catch (error) {
      res.status(500).json({ message: "Erreur lors de l'inscription", error: error.message });
  }
};

// Connexion avec PIN / Face ID / Touch ID
exports.login = async (req, res) => {
  try {
    const { pin, biometricType } = req.body;

    // Rechercher l'utilisateur
    const user = await User.findOne({ $or: [{ pin }, { faceIdEnabled: biometricType === 'FaceID' }, { touchIdEnabled: biometricType === 'TouchID' }] });

    if (!user) {
      return res.status(400).json({ message: "Utilisateur non trouvé ou méthode biométrique invalide" });
    }

    let isAuthenticated = false;
    if (pin) {
      // Vérifier le PIN
      isAuthenticated = await bcrypt.compare(pin, user.pin);
    } else if (biometricType === 'FaceID' && user.faceIdEnabled) {
      isAuthenticated = true;
    } else if (biometricType === 'TouchID' && user.touchIdEnabled) {
      isAuthenticated = true;
    }

    if (!isAuthenticated) {
      return res.status(400).json({ message: "Identifiants invalides" });
    }

    // Générer un token JWT
    const token = jwt.sign({ userId: user._id }, "secretkey", { expiresIn: '1h' });
    res.json({ message: "Connexion réussie", token });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la connexion", error: error.message });
  }
};

// Réinitialisation du PIN avec la question de sécurité
exports.resetPinWithSecurityQuestion = async (req, res) => {
  try {
    const { userId, securityAnswer, newPin } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const isAnswerCorrect = await bcrypt.compare(securityAnswer.toLowerCase(), user.securityAnswer);
    if (!isAnswerCorrect) {
      return res.status(400).json({ message: "Réponse incorrecte" });
    }

    const hashedNewPin = await bcrypt.hash(newPin, 10);
    user.pin = hashedNewPin;
    await user.save();

    res.status(200).json({ message: "PIN réinitialisé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la réinitialisation du PIN", error: error.message });
  }
};

// Réinitialisation du PIN avec Face ID / Touch ID
exports.resetPinWithBiometrics = async (req, res) => {
  try {
    const { userId, biometricType, newPin } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    if (
      (biometricType === "FaceID" && !user.faceIdEnabled) ||
      (biometricType === "TouchID" && !user.touchIdEnabled)
    ) {
      return res.status(400).json({ message: "Méthode biométrique non activée" });
    }

    const hashedNewPin = await bcrypt.hash(newPin, 10);
    user.pin = hashedNewPin;
    await user.save();

    res.status(200).json({ message: "PIN réinitialisé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la réinitialisation du PIN", error: error.message });
  }
};

// Récupérer tous les utilisateurs
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs", error: error.message });
  }
};

// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur", error: error.message });
  }
};
