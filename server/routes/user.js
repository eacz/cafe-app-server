const express = require('express');
const {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    desactivateUser,
} = require('../controllers/userController');

const app = express.Router();

app.get('/user', getUsers);

app.post('/user', createUser);

app.put('/user/:id', updateUser);

app.delete('/user/:id', deleteUser);

app.delete('/user/desactivate/:id', desactivateUser);

module.exports = app;
