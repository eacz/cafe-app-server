const express = require('express');
const router = express.Router();


const { getImage } = require('../controllers/imageController');
const verifyToken = require('../middlewares/verifyToken');

router.get('/image/:type/:img', verifyToken ,getImage);

module.exports = router;
