const express = require('express');
const router = express.Router();
const isAdmin = require('../middlewares/isAdmin');
const verifyToken = require('../middlewares/verifyToken');
const {
    getAllProducts,
    getProductByID,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
} = require('../controllers/productController');

router.get('/products', verifyToken, getAllProducts);
router.get('/products/:id', verifyToken, getProductByID);
router.post('/products', verifyToken, createProduct);
router.put('/products/:id', verifyToken, updateProduct);
router.delete('/products/:id', verifyToken, deleteProduct);
router.get('/products/search/:search', verifyToken, searchProducts)

module.exports = router;
