const express = require('express');
const paymentController = require('../controllers/paymentController');

const router = express.Router();

router.post('/transaction', paymentController.createPayment);
router.get('/history', paymentController.getPaymentHistory);

module.exports = router;