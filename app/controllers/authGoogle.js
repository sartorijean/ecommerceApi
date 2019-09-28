module.exports = {
    retornoAutenticacao: function(req, res) {
        req.session.token = req.user.token;
        //console.log(req.user);
        res.json( {
            token: req.session.token,
            name: req.user.profile.displayName,
            email: req.user.profile.emails[0].value
        });
    },
    validate: function(req, res, next){
        if (req.session.token){
            res.cookie('token', req.session.token);
            console.log('cookie de dessão setado');
            next();
        } else {
            res.cookie('token', '');
            console.log('cookie de sessão NÃO setado');
            res.redirect('/ecommerce/auth/google');
        }
    },
    logout: function(req, res) {
        req.logout();
        req.session = null;
        res.redirect('/');
    }
};