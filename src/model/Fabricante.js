const { Schema, model} = require('mongoose');

const FabricanteSchema = new Schema({
    nome: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = model('Fabricante', FabricanteSchema);