const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

router.post('/add', jwtMiddleware, activityController.create);

module.exports = router;