const { Schema, model} = require('mongoose');

const SistemaSchema = new Schema({
    nome: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = model('Sistema', SistemaSchema);