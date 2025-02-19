const express = require("express");
const { register, login, resetPinWithSecurityQuestion, resetPinWithBiometrics, getUsers, deleteUser } = require("../controllers/authController");

const router = express.Router();

// Routes d'inscription et de connexion
router.post("/register", register);
router.post("/login", login);

// Réinitialisation du PIN
router.post("/reset-pin/security-question", resetPinWithSecurityQuestion);
router.post("/reset-pin/biometrics", resetPinWithBiometrics);

// Gestion des utilisateurs
router.get("/users", getUsers);
router.delete("/users/:userId", deleteUser);

module.exports = router;
