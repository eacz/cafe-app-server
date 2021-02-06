const express = require('express');
const router = express.Router();

const isAdmin = require('../middlewares/isAdmin');
const verifyToken = require('../middlewares/verifyToken');
const {
    getCategories,
    getCategoryByID,
    addCategory,
    updateCategory,
    deleteCategory, 
} = require('../controllers/categoryController');

router.get('/categories', verifyToken, getCategories);
router.get('/categories/:id', verifyToken, getCategoryByID);
router.post('/categories', verifyToken, addCategory);
router.put('/categories/:id', verifyToken, updateCategory);
router.delete('/categories/:id', [verifyToken, isAdmin], deleteCategory);

module.exports = router;
