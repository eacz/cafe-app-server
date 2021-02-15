const express = require('express');
const fileUpload = require('express-fileupload');
const { upload } = require('../controllers/uploadController');
const app = express();

app.use(fileUpload());

app.put('/upload/:type/:id', upload); 

module.exports = app;
