const { Schema, model} = require('mongoose');

const CategoriaDespesaSchema = new Schema({
    categoria: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = model('CategoriaDespesa', CategoriaDespesaSchema);