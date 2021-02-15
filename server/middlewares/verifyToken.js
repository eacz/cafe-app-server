const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.get('x-auth-token') || req.query.token;

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ ok: false, err: { message: 'Invalid token' } });
        }

        req.user = decoded.user;
        next();
    });
};

module.exports = verifyToken;
