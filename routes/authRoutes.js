const express = require('express');
const { register, login, resetPin, getUsers, deleteUser } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/reset-pin', resetPin);
router.get('/users', getUsers);
router.delete('/delete/:id', deleteUser);

module.exports = router;