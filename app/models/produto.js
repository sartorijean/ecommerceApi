const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const produtoSchema = new Schema({
   // Tipos Aceitáveis: String, Number, Boolean, Date, Array, ObjectId 
   nome: String,
   preco: Number,
   descricao: String,
   quantidadeEstoque: Number,
});
module.exports = mongoose.model('Produto', produtoSchema, 'produtodesconto');