const express = require('express');
const {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    desactivateUser,
} = require('../controllers/userController');
const isAdmin = require('../middlewares/isAdmin');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();

router.get('/user', verifyToken, getUsers);

router.post('/user', [verifyToken, isAdmin], createUser);

router.put('/user/:id', [verifyToken, isAdmin], updateUser);

router.delete('/user/:id', [verifyToken, isAdmin], deleteUser);

router.delete('/user/desactivate/:id', verifyToken, desactivateUser);

module.exports = router;
