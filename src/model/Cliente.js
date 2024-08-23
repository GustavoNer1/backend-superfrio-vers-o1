const { Schema, model} = require('mongoose');

const ClienteSchema = new Schema({
    nome: {
        type: String,
        required: true
    },
    cidade: {
        type: String,
        required: true
    },
    uf: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = model('Cliente', ClienteSchema);