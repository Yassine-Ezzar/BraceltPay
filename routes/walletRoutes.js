const express = require('express');
const router = express.Router();
const walletController = require('../controllers/WalletController');

router.post('/add-card', walletController.addCard);
router.get('/cards', walletController.getAllCards);
router.delete('/delete-card/:id', walletController.deleteCard);
router.post('/scan', walletController.scanCard);

module.exports = router;