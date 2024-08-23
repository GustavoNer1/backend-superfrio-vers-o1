const { Schema, model} = require('mongoose');

const DespesaSchema = new Schema({
    dataentrada: {
        type: Date,
        required: true
    },
    numero: {
        type: String,
        required: true
    },
    // DRAFT, PENDING, APPROVED, REJECTED
    status: {
        type: String,
        required: true
    },
    pdflink: {
        type: String
    },
    idrequester: {
        type: String,
        required: false
    },
    nomerequester: {
        type: String,
        required: false
    },
    idaprovador: {
        type: String,
        required: false
    },
    nomeaprovador: {
        type: String,
        required: false
    },
    commaprovador: {
        type: String,
        required: false
    },
    obsgeral: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

module.exports = model('Despesa', DespesaSchema);