exports.isAuthenticated = (req, res, next) => {
    if (req.session.usuario) {
        return next();
    }
    res.redirect('/auth/login');
};
