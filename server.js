const express = require ('express');
const app = express();
const mongoose = require('mongoose');
const bodyparser = require('body-parser');

const Usuario = require ('./app/models/usuario');
const CupomDesconto = require('./app/models/cupomdesconto');

const porta = 3000;

mongoose.connect('mongodb+srv://usrmongo:senhausrmongo@cluster0-5uv2a.mongodb.net/ecommerce?retryWrites=true&w=majority',
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

app.post('/cupons', function(req, res) {
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
});

app.get('/cupons', function (req, res) {
    // obter os usuários cadastrados no MongoDB
    CupomDesconto.find(function (error, cupons) {
        if (error) {
            res.send('Erro ao tentar recuperar os Cupons de Desconto disponíveis.', error);
        } else {
            res.json(cupons);
        }
    });
});



app.listen(porta, function (req, res){
    console.log("Servidor inicializado na porta", porta);
});
