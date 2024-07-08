const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/validate', jwtMiddleware, authController.validate);

module.exports = router;