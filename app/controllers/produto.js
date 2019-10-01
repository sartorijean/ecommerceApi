const mongoose = require('mongoose');
const Produto = require('../models/produto');
const ObjectId = mongoose.Types.ObjectId;

const conversor = require('json-2-csv');

const getOptions = function(campos){
    return new Promise(function(resolve, reject) {
        let options = {
            keys: ['nome', 'preco', 'descricao']
        };

        if (campos) {
            let params = campos.split(',');
            options.keys = params;
        }

        resolve(options);
    })
}

module.exports = {
    // 3. Criar POST para Produto (utilizar método route do Express.Router()).
    adicionar: function (req, res) {
      var produto = new Produto(req.body);

       // Aqui vamos setar os campos do produto (via request):
       /*produto.nome = req.body.nome;
       produto.preco = req.body.preco;
       produto.descricao = req.body.descricao;
       produto.quantidadeEstoque = req.body.quantidadeEstoque;*/

       const error = produto.validateSync();
       if (error) {
           console.log('Mongoose Validation identificou problemas.');
           res.status(400).json(error);
           return;
       }

       // tratando a resposta na function
       produto.save(function(error, novoProduto) {
            if (error) {
                res.status(500).json(error); 
                return;
            }
            res.status(201).json(novoProduto);// Created
        });
   },
   // 4. Criar GET para Produto (todos). Recuperar Produtos. GET (All).
   listarTudo: function (req, res) {
        // obter os produtos cadastrados no MongoDB
        Produto.find(function (error, produtos) {
            if (error) {
                res.send('Erro ao tentar recuperar os Produtos disponíveis.', error);
            } else {
                res.json(produtos);
            }
        });
    },
    // 5. Criar GET para Produto específico. Implementação do GET que retorna um registro específico:
    listarUm: function (req, res) {
        // obter um Produto cadastrado no MongoDB
        Produto.findById(req.params.produtos_id, function (err, produto) {
            if (err) {
            res.send('Erro ao recuperar Produto pelo identificador informado.', err);
            } else if (produto){
            res.json(produto);
            } else {
            res.json({  
                message:'Id do Produto não localizado.',
                id: req.params.cupons_id
            });
            }
        });
    },
    // 6. Criar Rota para Alterar um Produto (PUT).
    alterar: function (req, res) {
        // Recupera o objeto para alterar
        Produto.findById(req.params.produtos_id, function (error, produto) {
            if (error) {
                res.send('Erro ao recuperar Produto pelo identificador informado.', error);
            } else if (produto){
                produto.nome = req.body.nome;
                produto.preco = req.body.preco;
                produto.descricao = req.body.descricao;
                produto.quantidadeEstoque = req.body.quantidadeEstoque;

                // tratando a resposta na function
                produto.save(function(error) {
                if (error) {
                    res.send('Erro ao tentar gravar o Produto...: ' + error);
                    }
                    res.json({ message: 'Produto atualizado com Sucesso!'});
                });
            } else {
                res.json({  
                    message:'Id do Produto não localizado.',
                    id: req.params.cupons_id
                });
            }
        });
    },
    // 7. Criar Rota para Excluir um Produto (DELETE). 
    // Vamos utilizar o id (que é único) para excluir um registro específico.
    excluir: function(req, res) {
        // Excluir um Produto que coincide com o filtro
        Produto.deleteOne({ _id: req.params.produtos_id },
            function (error, resultado) {
                if(error) {
                    res.send('Erro ao tentar excluir um Produto...: ' + error);
                }
        console.log('Resultado:' + resultado);

                if (resultado.n === 0) {
                    res.json( {
            message: 'O produto informado não existe.'
            });
                } else {
                    // resposta OK
                    res.json({message: 'Produto excluído com sucesso.'});
                }
            });
    },
    // 8. Criar Rota para Alterar Parcial um Produto (PATCH). 
    alterarParcial: function (req, res) {
        var updateObject = req.body; 
        var id = req.params.produtos_id;
        Produto.updateOne({_id : ObjectId(id)}, {$set: updateObject},
            function (error) {
                if (error) {
                    res.status(500).json(error);
                } else {
                    res.json ({message: 'Produto atualizado!!'});
                }
            }
        );
    },
    listarParametrizado: function (req, res) {
        Produto.find(function(erro, produtos) {
            if (erro){
                res.status(500).json({
                    message: 'Erro ao recuperar Produtos'+erro
                });
            }

            if (req.params.saida && req.params.saida === 'csv'){
                // fazer chamada da Promise
                getOptions(req.params.campos)
                    .then(function(options){
                        return conversor.json2csvAsync(produtos, options);
                    })
                    .then(function(csv){
                        res.set('Content-Type', 'text/csv');
                        res.setHeader('Content-disposition',
                        'attachment;filename=produtos.csv');
                        res.send(csv);
                    })
                    .catch(erro => {
                        res.status(500).json(erro);
                    })
            } else {
                res.status(200).json (produtos);
            }
        })
    }
}
