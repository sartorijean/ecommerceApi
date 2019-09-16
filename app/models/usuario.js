const mongoose =  require('mongoose');
const bcrypt = require('bcrypt');

const schemaUsuario = mongoose.Schema(
    {
        nome: {
            type: String,
            required: true,
            trim: true,
            unique: true },
        email: String,
        senha: {
            type: String,
            required: true,
            trim: true
        }
    }
);



// -----------------
// Validations - implementação futura
// -----------------

// -----------------
// Pré - Save
// -----------------
schemaUsuario.pre('save', function (next) {
    const usuario = this;
    // não encriptar se o usuário não for novo ou não estiver sendo modificado
    if (!usuario.isModified || !usuario.isNew) {
        next();
    } else {
        bcrypt.hash(usuario.senha, 
            parseInt(process.env.BCRYPT_SALT_ROUNDS),
            function(err, hash) {
                if (err) {
                    console.log('Erro ao encriptar senha do usuário',
                        usuario.nome);
                    next({message: err.message});
                } else {
                    usuario.senha = hash;
                    next();
                }
            })
    }
});


// Vamos criar um modelo
const Usuario = 
 mongoose.model('Usuario', schemaUsuario, 'usuario');

 module.exports = Usuario;