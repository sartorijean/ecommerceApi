const mongoose = require('mongoose');

function validarDataMaior(dataInformada) {
    return new Date(dataInformada) > new Date();
}

const enumTipo = {
    values: ['DESCONTO','FRETEGRATIS','PROMOCIONAL'],
    message: 'Tipo `{VALUE}` não definido.'
}

const Schema = mongoose.Schema;

let schemaCupom = new Schema({
    dataInicial: Date,
    dataFinal: Date,
    valorInicial: Number,
    valorFinal: Number,
    quantidadeCupons:   {type: Number},
    quantidadeUsada: Number,
    percentualDesconto: {type: Number },
    tipo: { type: String}
}, {strict: "throw"});

// --------
// Validations
// ---------
schemaCupom.path('dataInicial').validate(validarDataMaior, 
    'Data informada `{VALUE}` para o campo `{PATH}`'+
    'deve ser maior que a data corrente.');
schemaCupom.path('dataFinal').validate(function() {
    return (new Date(this.dataFinal)> new Date(this.dataInicial));
}, 'Data final deve ser maior que a data inicial.');
schemaCupom.path('quantidadeCupons')
    .min( 0, 'Valor `{VALUE}` inválido. Deve ser maior que `{MIN}`')
    .max( 999);
schemaCupom.path('quantidadeCupons').required(
    true, 'Percentual de Desconto é requerido');
schemaCupom.path('tipo').enum(enumTipo).trim(true);

// -----
// Pré-Save
// -----
schemaCupom.pre('save', function (next){
    if(!this.tipo) {
        console.log('entrou no if. Não informou tipo');
        this.tipo = enumTipo.values[0];
    }
    next();
});

const CupomDesconto = mongoose.model('CupomDesconto',
 schemaCupom, 'cupomdesconto');

 module.exports = CupomDesconto;