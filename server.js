const express = require ('express');
const app = express();
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const ecommerceRouter = express.Router();

const Usuario = require ('./app/models/usuario');
const CupomDesconto = require('./app/models/cupomdesconto');
const ObjectId = mongoose.Types.ObjectId;

const porta = process.env.PORT || 3000;

mongoose.connect('mongodb+srv://usrmongo:senhausrmongo@cluster01-lof0n.mongodb.net/ecommerce?retryWrites=true&w=majority',
 {useNewUrlParser: true});

app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());

// Middleware. Toda requisição passará aqui
app.use(function(req, res, next) {
    console.log('Algo está acontecendo aqui.', req.url);
    // Garantir que o próximo comando seja executado.
    next();
});

app.get('/', function (req, res) {
    res.send('Bem vindo a nossa loja virtual');
});

app.get('/usuarios', function (req, res) {
    // obter os usuários cadastrados no MongoDB
    Usuario.find(function(erro, usuarios){
        if (erro) {
            res.send('Erro ao tentar recuperar os Usuarios', erro);
        } else {
            res.json(usuarios);
        }
    });
});


// 2. Criar rotas para o Router

// Rotas que terminam com /cupons (serve: POST e GET ALL)
ecommerceRouter.route('/cupons')
    ///Método cadastrar cupom: POST
    .post( function(req, res) {
        let cupomDesconto = new CupomDesconto();
        cupomDesconto.dataInicial = req.body.dataInicial;
        cupomDesconto.dataFinal = req.body.dataFinal;
        cupomDesconto.valorInicial = req.body.valorInicial;
        cupomDesconto.valorFinal = req.body.valorFinal;
        cupomDesconto.quantidadeCupons = req.body.quantidadeCupons;
        cupomDesconto.quantidadeUsada = req.body.quantidadeUsada;
        cupomDesconto.percentualDesconto = req.body.percentualDesconto;

        cupomDesconto.save(function (error){
            if (error){
                res.send('Erro ao gravar Cupom de Desconto'+ error);
            }
            res.json({message: 'Cupom de desconto cadastrado!'});
        });
    })
    // Método GET Cupons 
    .get( function (req, res) {
        // obter os usuários cadastrados no MongoDB
        CupomDesconto.find(function (error, cupons) {
            if (error) {
                res.send('Erro ao tentar recuperar os Cupons de Desconto disponíveis.', error);
            } else {
                res.json(cupons);
            }
        });
    });

    // Rotas que terminarem com /cupons/:cupons_id (GET, PUT, DELETE e PATCH)
    ecommerceRouter.route('/cupons/:cupons_id')
        .get(function(req, res){
            CupomDesconto.findById(ObjectId(req.params.cupons_id),
                function(error, cupomDesconto){
                    if (error){
                        res.send('Erro ao recuperar Cupom de Desconto'+error);
                    } else if (cupomDesconto){
                        res.json(cupomDesconto);
                    } else {
                        res.json({
                            message: 'Id do Cupom não localizado',
                            id: req.params.cupons_id});
                    }
                })
        })

// Alterar um recurso específico
    .put(function(req, res){
        // Recupera o objeto para alterar
        CupomDesconto.findById(ObjectId(req.params.cupons_id),
            function(error, cupomDesconto) {
                if (error) {
                    res.send('Cupom não localizado'+error);
                } else if (cupomDesconto) {
                    // já posso alterar meu cupom de Desconto
                    if(req.body.dataInicial) {
                        cupomDesconto.dataInicial = req.body.dataInicial;
                    }
                    if(req.body.dataFinal) {
                        cupomDesconto.dataFinal = req.body.dataFinal;
                    }
                    if (req.body.valorInicial) {
                        cupomDesconto.valorInicial = req.body.valorInicial;
                    }
                    if (req.body.quantidadeCupons) {
                        cupomDesconto.quantidadeCupons = req.body.quantidadeCupons;
                    }
                    if (req.body.valorFinal) {
                        cupomDesconto.valorFinal = req.body.valorFinal;
                    }
                    if (req.body.percentualDesconto) {
                        cupomDesconto.percentualDesconto = req.body.percentualDesconto;
                    }
                    if (req.body.quantidadeUsada) {
                        cupomDesconto.quantidadeUsada = req.body.quantidadeUsada;
                    }
                    //persistir no mongoDB
                    cupomDesconto.save(function(error) {
                        if (error) {
                            res.send('Erro ao gravar o Cupom.'+error);
                        }
                        res.json({message: 'Cupom atualizado com sucesso!'});
                    });
                } else {
                    res.json({
                        message: 'Id do Cupom não localizado',
                        id: req.params.cupons_id});
                }
            });
    })

// Alteração de um objeto parcialmente
    .patch( function(req, res) {

        let id = req.params.cupons_id;
        let cupomDesconto = req.body;

        CupomDesconto.updateOne(
            {_id: ObjectId(id)},
            {$set: cupomDesconto}, 
            function(error) {
                if (error) {
                    res.send('Erro ao alterar cupom parcial.'+ error);
                }
                else {
                    res.json({message: 'Cupom de Desconto atualizado!'});
                }
            }
        )
    }
    )

    // Excluir Cupom de Desconto
    .delete( function (req, res){
        let id = req.params.cupons_id;
        CupomDesconto.deleteOne(
            {_id: ObjectId(id)},
            function (error, resultado) {
                if (error) {
                    res.send('Erro ao excluir:'+error);
                } else if (resultado.n ===0) {
                    res.json({message: 'O cupom informado não existe'});
                } else {
                    console.log('resultado:', resultado);
                    res.json(
                        {message: 'Cupom de desconto Excluído'});
                }
            })
    });

app.use('/ecommerce', ecommerceRouter);

app.listen(porta, function (req, res){
    console.log("Servidor inicializado na porta", porta);
});
