const mongoose =  require('mongoose');

const schemaUsuario = mongoose.Schema(
    {
        nome: String,
        email: String
    }
);

// Vamos criar um modelo
const Usuario = 
 mongoose.model('Usuario', schemaUsuario, 'usuario');

 module.exports = Usuario;