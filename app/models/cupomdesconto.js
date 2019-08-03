const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schemaCupom = new Schema({
    dataInicial: Date,
    dataFinal: Date,
    valorInicial: Number,
    valorFinal: Number,
    quantidadeCupons: Number,
    quantidadeUsada: Number,
    percentualDesconto: {
        type: Number,
        required: [true, 'Percentual de Desconto é requerido'],
    }
});

const CupomDesconto = mongoose.model('CupomDesconto',
 schemaCupom, 'cupomdesconto');

 module.exports = CupomDesconto;