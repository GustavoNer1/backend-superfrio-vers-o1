const { Schema, model} = require('mongoose');

const CatalogoSchema = new Schema({
    nome: {
        type: String,
        required: true
    },
    tipo: {
        type: Number,
        required: true
    },
    link: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = model('Catalogo', CatalogoSchema);