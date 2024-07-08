const express = require('express');
const router = express.Router();
const breedController = require('../controllers/breedController');

router.get('/get', breedController.getAll);

module.exports = router;