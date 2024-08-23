const { Schema, model} = require('mongoose');

const PrecadastroSchema = new Schema({
    nome: {
        type: String,
        required: true
    },
    telefone: {
        type: String,
        required: true
    },
    email: {
        type: String
    }   
}, {
    timestamps: true
});

module.exports = model('Precadastro', PrecadastroSchema);
