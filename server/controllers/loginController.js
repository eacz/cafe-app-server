const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const login = (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email }, (err, user) => {
        if (err) {
            return res.status(500).json({ ok: false, err });
        }
        if (!user) {
            return res.status(400).json({ ok: false, err: { message: '(User) or Password invalid' } });
        }

        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(400).json({ ok: false, err: { message: 'User or (Password) invalid' } });
        }

        const token = jwt.sign({user}, process.env.SECRET_KEY, {expiresIn: process.env.TOKEN_EXP});

        res.json({ ok: true, user, token });
    });
};

module.exports = {
    login,
};
