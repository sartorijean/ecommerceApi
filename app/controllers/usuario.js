const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    adicionar: function (req, res) {
        const {nome, senha, email} = req.body;
        const usuario = new Usuario({nome, senha, email});

        // Validaçao manual - forçar a execução do mongoose Validation
        const error = usuario.validateSync();
        if (error) {
            res.status(400).json(error);
        }
        else {
            usuario.save(function(error, novoUsuario){
                if (error) {
                    res.status(500).json(error);
                } else {
                    res.status(201).json(novoUsuario);
                }
            })
        }
    },
    login: function(req, res) {
        const {nome, senha} = req.body;
        Usuario.findOne({nome}, function (err, usuario) {
            if (!err && usuario) {
                // comparamos as senhas
                bcrypt.compare(senha, usuario.senha, function(err, match){
                    if (match) {
                        // OK
                        // Criação do Token JWT
                        const payload= {usuario: usuario.nome};
                        const secret = process.env.JWT_SECRET;
                        const header = {expiresIn: 300, issuer:'http://upf.br'};
                        const token = jwt.sign(payload, secret, header);
                        res.status(200).json({
                            result: usuario,
                            token: token
                        });
                    } else {
                        // Não autorizado
                        res.status(401).json( {
                            message: 'Senha informada não confere'
                        });
                    }
                });
            } else {
                // Usuario não encontrado
                res.status(404).json({
                    message: 'Usuário não encontrado'
                });
            }
        })
    },
    listarTodos: function(req, res) {
        // Vamos obter o token decodificado
        const payload = req.decoded;
        console.log('PAYLOAD:', payload);
        //testar se o usuário é o admin
        if (payload && payload.usuario === 'admin') {

            // obter todos os usuários
            Usuario.find(function(error, usuarios){
                if (error) {
                    res.status(502).json(error); 
                } else {
                    res.status(200).json(usuarios);
                }
            });
        } else {
            res.status(401).json( {
                message: 'Usuário não autorizado!'
            });
        }
    }
};