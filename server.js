const express = require ('express');
const app = express();
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const ecommerceRouter = express.Router();
const hateoasLink = require('express-hateoas-links');
require('dotenv-safe').config();
const passport = require('passport');
require('./app/utils/passport')(passport);
const cookieParser  = require('cookie-parser'),
      cookieSession = require ('cookie-session');
const helmet = require('helmet');
const morgan= require('morgan');

const winston = require('./app/utils/winston');

const routes = require('./routes');

const Usuario = require ('./app/models/usuario');

const porta = process.env.PORT || 3000;

mongoose.connect('mongodb+srv://usrmongo:senhausrmongo@cluster01-lof0n.mongodb.net/ecommerce?retryWrites=true&w=majority',
 {useCreateIndex: true, useNewUrlParser: true});

app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
// setar uso do módulo hateoas
app.use(hateoasLink);
app.use(passport.initialize());
//Middleware de sessão
app.use(cookieSession({
    name: 'session',
    keys: [process.env.SESSION_KEY]
}));
app.use(cookieParser());
app.use(helmet());
app.use(morgan('tiny', {stream: winston.stream}));

// Middleware. Toda requisição passará aqui
/*app.use(function(req, res, next) {
    console.log('Algo está acontecendo aqui.', req.url);
    // Garantir que o próximo comando seja executado.
    next();
});*/

app.get('/', function (req, res) {
    res.send('Bem vindo a nossa loja virtual');
    winston.info('Página inicial da aplicação');
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


app.use('/ecommerce', routes(ecommerceRouter, passport));

app.listen(porta, function (req, res){
    console.log("Servidor inicializado na porta", porta);
});
