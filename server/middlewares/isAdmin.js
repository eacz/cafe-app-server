const isAdmin = (req, res, next) => {
    const user = req.user;
    if (user.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res
            .status(401)
            .json({ ok: false, err: { message: "You're not authorized to perfom this action" } });
    }
};

module.exports = isAdmin;
