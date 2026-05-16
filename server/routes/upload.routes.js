const express = require('express');
const router = express.Router();
const { uploadSingleImage, uploadMultipleImages } = require('../controllers/upload.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

router.use(verifyToken, isAdmin);
router.post('/image', upload.single('image'), uploadSingleImage);
router.post('/images', upload.array('images', 10), uploadMultipleImages);

module.exports = router;
