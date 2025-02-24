const express = require('express');
const locationController = require('../controllers/locationController');

const router = express.Router();

router.post('/update', locationController.updateLocation);
router.get('/get', locationController.getLocation);

module.exports = router;