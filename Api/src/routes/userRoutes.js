const express = require('express');
const router = express.Router();
const multer = require('multer');
const userController = require('../controllers/userController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');
const { uploadAndDeleteS3Middleware } = require('../middlewares/awsMiddleware');

const upload = multer();

router.post('/users', userController.createUser);
//router.get('/users/:id', userController.getUser);
router.post('/image-profile', jwtMiddleware, upload.single("image"), uploadAndDeleteS3Middleware('profiles/users'), userController.imagePorfileUpload);

module.exports = router;