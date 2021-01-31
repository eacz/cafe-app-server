const bcrypt = require('bcrypt');
const _ = require('underscore');
const User = require('../models/User');

const createUser = (req, res) => {
    const { name, email, password, role } = req.body;
    const user = new User({
        name,
        email,
        password: bcrypt.hashSync(password, 10),
        role,
    });

    user.save((error, userdb) => {
        if (error) {
            return res.status(400).json({ ok: false, error });
        }
        // user.password = undefined
        res.json({ ok: true, user: userdb });
    });
};

const updateUser = (req, res) => {
    const id = req.params.id;
    const body = _.pick(req.body, ['name', 'email', 'img', 'role', 'state']);

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userdb) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }
        return res.json({ ok: true, user: userdb });
    });
};

const getUsers = (req, res) => {
    let from = req.query.from || 0;
    from = Number(from);

    let limit = req.query.limit || 5;
    limit = Number(limit);

    User.find({ state: true }, 'name email role state google img')
        .skip(from)
        .limit(limit)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({ ok: false, err });
            }

            User.countDocuments({ state: true }, (err, count) => {
                if (err) {
                    return res.status(400).json({ ok: false, err });
                }
                res.json({
                    ok: true,
                    users,
                    totalUsers: count,
                });
            });
        });
};

const deleteUser = (req, res) => {
    const id = req.params.id;

    User.findByIdAndRemove(id, (err, userDeleted) => {
        if (err) {
            return res.status(400).json({ ok: false, err });
        }
        if (!userDeleted) {
            return res.status(400).json({ ok: false, err: { message: "User don't finded" } });
        }

        res.json({
            ok: true,
            user: userDeleted,
        });
    });
};

const desactivateUser = (req, res) => {
    const id = req.params.id;
    User.findByIdAndUpdate(id, { state: false }, { new: true }, (err, user) => {
        if (err) {
            return res.status(400);
        }
    });
    return res.json({ ok: true, msg: 'account desactivated' });
};

module.exports = {
    createUser,
    updateUser,
    getUsers,
    deleteUser,
    desactivateUser,
};
