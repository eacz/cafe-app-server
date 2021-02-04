const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT);

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

        const token = jwt.sign({ user }, process.env.SECRET_KEY, { expiresIn: process.env.TOKEN_EXP });

        res.json({ ok: true, user, token });
    });
};

//google configuration
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT,
    });
    const payload = ticket.getPayload();
    const { name, email, picture } = payload;

    return {
        name,
        email,
        img: picture,
        google: true,
    };
}

const googleLogin = async (req, res) => {
    const token = req.body.idtoken;

    try {
        const googleUser = await verify(token);
        User.findOne({ email: googleUser.email }, (err, userdb) => {
            if (err) {
                return res.status(500).json({ ok: false, err });
            }

            if (userdb) {
                console.log(userdb);
                if (!userdb.google) {
                    return res.status(400).json({
                        ok: false,
                        err: { message: 'You should authenticate with your account, not with google' },
                    });
                } else {
                    const token = jwt.sign({ user: userdb }, process.env.SECRET_KEY, {
                        expiresIn: process.env.TOKEN_EXP,
                    });
                    return res.json({ ok: true, user: userdb, token });
                }
            } else {
                //creating the new user
                const user = new User();
                const { name, email, picture } = googleUser;
                user.name = name;
                user.email = email;
                user.img = picture;
                user.google = true;
                user.password = ':D';

                user.save((err,userdb) => {
                    if(err){
                        return res.status(500).json({ok:false, err})
                    }
                    const token = jwt.sign({ user: userdb }, process.env.SECRET_KEY, {
                        expiresIn: process.env.TOKEN_EXP,
                    });
                    return res.json({ ok: true, user: userdb, token });
                })
            }
        });
    } catch (err) {
        res.status(403).json({ ok: false, err });
    }
};

module.exports = {
    login,
    googleLogin,
};
