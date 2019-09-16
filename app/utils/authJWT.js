const jwt = require('jsonwebtoken');

module.exports = {
    validadorDeToken: function (req, res, next) {
        const tokenAutorizacao = req.headers.authorization;
        let payload;
        if (tokenAutorizacao) {
            const token = tokenAutorizacao.split(' ')[1]; // Bearer Token
            const header= {expiresIn: 300, issuer:'http://upf.br'};
            try {
                payload = jwt.verify(token, process.env.JWT_SECRET, header);

                // devolvemos o token decodificado para o objeto de solicitação
                req.decoded = payload;
                // Chamar next para passar execução para o middleware seguinte
                next();
            } catch (err) {
                res.status(401).json(err);
            }
        } else {
            res.status(401).json({message: 'Token requerido'});
        }
    },
};