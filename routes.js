const cupomDescontoCon = require('./app/controllers/cupomdesconto');
const produtoCon = require('./app/controllers/produto'),
      usuarioCon = require('./app/controllers/usuario');
const validadorToken = require ('./app/utils/authJWT').validadorDeToken;

module.exports = function(ecommerceRouter, passport){

// 2. Criar rotas para o Router de Cupons

// Rotas que terminam com /cupons (serve: POST e GET ALL)
ecommerceRouter.route('/cupons')
    //Método cadastrar cupom: POST
    .post(cupomDescontoCon.adicionar )
    // Método GET Cupons 
    .get( cupomDescontoCon.listarTudo);

// Rotas que terminarem com /cupons/:cupons_id (GET, PUT, DELETE e PATCH)
ecommerceRouter.route('/cupons/:cupons_id')
    .get(cupomDescontoCon.listarUm)
    // Alterar um recurso específico
    .put(cupomDescontoCon.alterar)
    // Alteração de um objeto parcialmente
    .patch(cupomDescontoCon.alterarParcial )
    // Excluir Cupom de Desconto
    .delete(cupomDescontoCon.excluir );


// 2. Criar rotas para o Router de Produtos

ecommerceRouter.route('/produtos')
    .post(produtoCon.adicionar)
    .get(produtoCon.listarTudo);

ecommerceRouter.route('/produtos/:produtos_id')
    .get(produtoCon.listarUm)
    .put(produtoCon.alterar)
    .delete(produtoCon.excluir)
    .patch(produtoCon.alterarParcial);

/**
 * Usuario
 */
ecommerceRouter.route('/usuarios')
    .post(usuarioCon.adicionar)
    .get(validadorToken, usuarioCon.listarTodos);

ecommerceRouter.route('/login')
    .post(usuarioCon.login);

/**
 * OAuth
 */
ecommerceRouter.route('/auth/google')
    .get(passport.authenticate('google',
        {scope: ['https://www.googleapis.com/auth/userinfo.profile']}
    )
);
ecommerceRouter.route('/auth/google/callback')
    .get(passport.authenticate('google',
        {failRedirect: '/'}),
        function (req, res) {
            res.json({
                token: 'Aqui vamos mostrar o token'
            });
});

return ecommerceRouter;
};