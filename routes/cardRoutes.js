const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');

router.post('/add', cardController.addCard);
router.delete('/:cardId', cardController.deleteCard);
router.get('/', cardController.getCards);

module.exports = router;