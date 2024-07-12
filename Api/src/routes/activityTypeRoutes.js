const express = require('express');
const router = express.Router();
const activityTypeController = require('../controllers/activityTypeController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');


router.get('/get', activityTypeController.getAll);

module.exports = router;