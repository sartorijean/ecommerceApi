const mongoose = require('mongoose');
const CupomDesconto = require('../models/cupomdesconto');
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
    listarTudo: function (req, res) {
        // obter os usuários cadastrados no MongoDB
        CupomDesconto.find(function (error, cupons) {
            if (error) {
                res.statusCode =502; // Bad Gateway 
                // Servidor recebeu uma resposta inválida
                res.json({message: 'Erro ao recuperar Cupons '+ error});
            } else {
                res.statusCode = 200;
                res.json(cupons);
            }
        });
    },

    adicionar: function(req, res) {
        let cupomDesconto;
        try {
             cupomDesconto = new CupomDesconto(req.body);
        } catch(e) {
            // Basd Request: o que o usuário mandou nao foi legal
            res.status(400).json(e);
            return;
        }
        /*cupomDesconto.dataInicial = req.body.dataInicial;
        cupomDesconto.dataFinal = req.body.dataFinal;
        cupomDesconto.valorInicial = req.body.valorInicial;
        cupomDesconto.valorFinal = req.body.valorFinal;
        cupomDesconto.quantidadeCupons = req.body.quantidadeCupons;
        cupomDesconto.quantidadeUsada = req.body.quantidadeUsada;
        cupomDesconto.percentualDesconto = req.body.percentualDesconto;*/
    
        // Validação manual - forçar a execução
        const error = cupomDesconto.validateSync();
        if (error) {
            console.log ('Mongoose Validation identificou problemas');
            res.status(400).json(error);
            return;
        }

        cupomDesconto.save(function (error, novoCupom){
            if (error){
                console.log('Passou aqui quando tentou gravar');
                res.statusCode = 500;
                res.json(error);
            } else {

                let url = req.protocol + '://'+ req.get('host')+ req.originalUrl;
                res.status(201).json( cupomDesconto,
                    [{rel: "recuperar", method: "GET", href: url + novoCupom._id, title: 'Recuperar Cupom de Desconto'}]);
            }
        });
    },
    listarUm: function(req, res){
        if (!ObjectId.isValid(req.params.cupons_id)){
            res.status(400).json({
                message: 'Código inválido'
            });
            return;
        }
        CupomDesconto.findById(ObjectId(req.params.cupons_id),
            function(error, cupomDesconto){
                if (error){
                    res.statusCode=502;
                    res.json(error);
                } else if (cupomDesconto){

                    let url = req.protocol + '://'+ req.get('host')+ req.originalUrl;

                    res.status(200).json(cupomDesconto,
                        [{rel: "alterar", href: url, method: "PUT" },
                         {rel: "deletar", href: url, method: "DELETE", title: "Excluir Cupom de Desconto"} ] );

                } else {
                    res.status(202).json({message: 'Id do Cupom não localizado', id: req.params.cupons_id});
                }
            })
    },
    alterar: function(req, res){
        // Recupera o objeto para alterar
        CupomDesconto.findById(ObjectId(req.params.cupons_id),
            function(error, cupomDesconto) {
                if (error) {
                    res.statusCode=502;
                    res.json(error);
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
                            res.statusCode = 500;
                            res.json(error);
                        } else {
                            res.status(200).json({message: 'Cupom atualizado com sucesso!'});
                        }
                    });
                } else {
                    res.status(202).json({
                        message: 'Id do Cupom não localizado',
                        id: req.params.cupons_id});
                }
            });
    },
    excluir: function (req, res){
        let id = req.params.cupons_id;
        CupomDesconto.deleteOne(
            {_id: ObjectId(id)},
            function (error, resultado) {
                if (error) {
                    res.statusCode=409; // Conflict
                    res.json(error);
                } else if (resultado.n ===0) {
                    res.status(202).json({message: 'O cupom informado não existe'});
                } else {
                    console.log('resultado:', resultado);
                    res.status(200).json({message: 'Cupom de desconto Excluído'});
                }
            })
    },
    alterarParcial: function(req, res) {

        let id = req.params.cupons_id;
        let cupomDesconto = req.body;
    
        const options = {runValidators: true};
        CupomDesconto.updateOne(
            {_id: ObjectId(id)},
            {$set: cupomDesconto}, options,
            function(error) {
                if (error) {
                    res.statusCode = 400; // Bad Request.
                    res.json(error);
                }
                else {
                    res.status(200).json({message: 'Cupom de Desconto atualizado!'});
                }
            }
        )
    }    
}