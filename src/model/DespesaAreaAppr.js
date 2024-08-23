const { Schema, model} = require('mongoose');

const DespesaAreaApprSchema = new Schema({
    nome: {
        type: String,
        required: true
    },
    aprovador: {
        type: String,
        required: true
    },
    idaprovador: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = model('DespesaAreaAppr', DespesaAreaApprSchema);