const EstrategiaGoogle = require('passport-google-oauth').OAuth2Strategy;

module.exports = function (passport) {
    
    // serializar o usuário para a sessao
    passport.serializeUser(function (usuario, callback) {
        callback(null, usuario);
    });

    //desserializar o usuário
    passport.deserializeUser(function(usuario, callback) {
        callback(null, usuario);
    });

    passport.use(new EstrategiaGoogle({
        // Variáveis gerados pelo Google Developers Console
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACKURL
    }, function(token, refrehToken, profile, callback){
        return callback(null, {
            profile: profile,
            token: token
        })   
    }))
};