const express = require('express');
const router = express.Router();
const multer = require('multer');
const jwtMiddleware = require('../middlewares/jwtMiddleware');
const { uploadAndDeleteS3Middleware } = require('../middlewares/awsMiddleware');
const horseController = require('../controllers/horseController');

const upload = multer();

router.get('/getByUser', jwtMiddleware, horseController.getAllByUser);
router.post('/add', jwtMiddleware, upload.single("image"), uploadAndDeleteS3Middleware('profiles/horses'), horseController.create);

module.exports = router;